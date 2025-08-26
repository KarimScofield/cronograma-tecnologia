@@ .. @@
 ALTER TABLE areas_responsaveis ENABLE ROW LEVEL SECURITY;
 ALTER TABLE times_squads ENABLE ROW LEVEL SECURITY;
 ALTER TABLE itens_cronograma ENABLE ROW LEVEL SECURITY;
 
 -- Políticas para areas_responsaveis
-CREATE POLICY "Permitir leitura de áreas" ON areas_responsaveis FOR SELECT USING (true);
-CREATE POLICY "Permitir inserção de áreas" ON areas_responsaveis FOR INSERT WITH CHECK (true);
-CREATE POLICY "Permitir atualização de áreas" ON areas_responsaveis FOR UPDATE USING (true);
+CREATE POLICY "Permitir leitura de áreas" ON areas_responsaveis FOR SELECT TO authenticated USING (true);
+CREATE POLICY "Permitir inserção de áreas" ON areas_responsaveis FOR INSERT TO authenticated WITH CHECK (true);
+CREATE POLICY "Permitir atualização de áreas" ON areas_responsaveis FOR UPDATE TO authenticated USING (true);
 
 -- Políticas para times_squads
-CREATE POLICY "Permitir leitura de times" ON times_squads FOR SELECT USING (true);
-CREATE POLICY "Permitir inserção de times" ON times_squads FOR INSERT WITH CHECK (true);
-CREATE POLICY "Permitir atualização de times" ON times_squads FOR UPDATE USING (true);
+CREATE POLICY "Permitir leitura de times" ON times_squads FOR SELECT TO authenticated USING (true);
+CREATE POLICY "Permitir inserção de times" ON times_squads FOR INSERT TO authenticated WITH CHECK (true);
+CREATE POLICY "Permitir atualização de times" ON times_squads FOR UPDATE TO authenticated USING (true);
 
 -- Políticas para itens_cronograma
-CREATE POLICY "Permitir leitura de itens" ON itens_cronograma FOR SELECT USING (true);
-CREATE POLICY "Permitir inserção de itens" ON itens_cronograma FOR INSERT WITH CHECK (true);
-CREATE POLICY "Permitir atualização de itens" ON itens_cronograma FOR UPDATE USING (true);
-CREATE POLICY "Permitir exclusão de itens" ON itens_cronograma FOR DELETE USING (true);