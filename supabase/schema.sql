-- Schéma NailApp — à exécuter dans l'éditeur SQL Supabase
-- Ordre d'exécution : types → profiles → fidelity_points → reviews → salon_settings → RLS

-- 1. Type rôle
CREATE TYPE user_role AS ENUM ('pro', 'cliente');

-- 2. Table profils (étend auth.users)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL DEFAULT 'cliente',
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table points de fidélité
CREATE TABLE fidelity_points (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points      INTEGER NOT NULL CHECK (points > 0 AND points <= 1000),
  label       TEXT NOT NULL,
  created_by  UUID NOT NULL REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table avis
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table paramètres salon (une seule ligne)
CREATE TABLE salon_settings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_name          TEXT NOT NULL DEFAULT '',
  points_per_visit    INTEGER NOT NULL DEFAULT 10,
  points_for_reward   INTEGER NOT NULL DEFAULT 100,
  reward_description  TEXT NOT NULL DEFAULT '1 soin offert',
  updated_by          UUID REFERENCES profiles(id),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_fidelity_points_cliente ON fidelity_points(cliente_id);
CREATE INDEX idx_fidelity_points_created ON fidelity_points(created_at);
CREATE INDEX idx_reviews_cliente ON reviews(cliente_id);
CREATE INDEX idx_reviews_visible ON reviews(is_visible);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fidelity_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_settings ENABLE ROW LEVEL SECURITY;

-- profiles : chaque utilisateur voit son propre profil, la pro voit tout
CREATE POLICY "Lecture profil personnel" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Pro voit tous les profils" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'pro')
  );

-- fidelity_points : la cliente voit ses points, la pro voit tout et peut insérer
CREATE POLICY "Cliente voit ses points" ON fidelity_points
  FOR SELECT USING (cliente_id = auth.uid());

CREATE POLICY "Pro voit tous les points" ON fidelity_points
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'pro')
  );

CREATE POLICY "Pro crédite des points" ON fidelity_points
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'pro')
  );

-- reviews : lecture publique pour les visibles, insertion sans auth (accès par UUID)
CREATE POLICY "Lecture avis visibles" ON reviews
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Pro voit tous les avis" ON reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'pro')
  );

CREATE POLICY "Insertion avis par cliente connue" ON reviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = cliente_id AND role = 'cliente')
  );

CREATE POLICY "Pro modifie la visibilité" ON reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'pro')
  );

-- salon_settings : lecture publique (affiché aux clientes), écriture pro uniquement
CREATE POLICY "Lecture paramètres publique" ON salon_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Pro modifie les paramètres" ON salon_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'pro')
  );

-- =============================================
-- TRIGGER : création automatique du profil à l'inscription
-- =============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'cliente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
