DO $$
DECLARE
  v_user_id UUID;
  v_task_id BIGINT;
  i INT;
  v_titles TEXT[] := ARRAY[
    'Homepage Redesign', 'Nieuwe logo schetsen', 'Marketing strategie uitwerken', 
    'Klantgesprek voorbereiden', 'SEO Optimalisatie', 'Website verhuizing', 
    'Server onderhoud', 'Nieuwsbrief Q3 schrijven', 'Social media planning', 
    'Facturatie nakijken', 'Briefing doornemen met team', 'Design systeem updaten', 
    'Mobiele weergave fixen', 'A/B Test opzetten', 'Fotografie selecteren', 
    'Copywriting aanpassen', 'Concept presentatie maken', 'Contracten vernieuwen', 
    'Feedback verwerken', 'Nieuwe functionaliteit inplannen'
  ];
  v_types TEXT[] := ARRAY['Design', 'Development', 'Marketing', 'Overig'];
  v_statuses TEXT[] := ARRAY['Open', 'In Behandeling', 'Wacht op feedback', 'Voltooid'];
  v_status TEXT;
BEGIN
  -- Zoek een bestaande gebruiker in de database op om de taken aan te koppelen
  SELECT id INTO v_user_id FROM profiles LIMIT 1;

  FOR i IN 1..20 LOOP
    -- Kies een willekeurige status
    v_status := v_statuses[1 + floor(random() * 4)];
    
    -- Insert de taak en bewaar het gegenereerde ID
    INSERT INTO db_tasks (
      task_title, 
      task_content, 
      status, 
      type, 
      date_start, 
      date_end, 
      estimated_hours, 
      "userID"
    ) 
    VALUES (
      v_titles[i], 
      'Dit is een uitgebreide omschrijving van de taak met alle benodigde achtergrondinformatie.

Belangrijke punten voor de uitvoering:
- Zorg ervoor dat alle bestaande functionaliteiten gewaarborgd blijven.
- Bespreek vooraf eventuele obstakels met de projectmanager.
- Test de oplevering zorgvuldig op zowel mobiel als desktop weergaven.

Daarnaast is het cruciaal dat de documentatie wordt nageleefd. Kleine details maken een groot verschil in de eindoplevering. Let goed op de afspraken zoals besproken in de recente teamvergadering.

Mochten er vragen zijn tijdens de uitvoering, wijzig de status dan even naar "Wacht op feedback". Succes met de uitwerking!',
      v_status,
      v_types[1 + floor(random() * 4)],
      CURRENT_DATE + (floor(random() * 10) || ' days')::interval,
      CURRENT_DATE + (floor(random() * 10 + 10) || ' days')::interval,
      floor(random() * 8) + 1,
      v_user_id
    ) RETURNING id INTO v_task_id;

    -- Voeg de initiële 'Taak aangemaakt' activiteit toe in het verleden
    INSERT INTO task_history (task_id, user_id, action, created_at)
    VALUES (
      v_task_id, 
      v_user_id, 
      'Taak aangemaakt',
      CURRENT_TIMESTAMP - (floor(random() * 5 + 1) || ' days')::interval
    );

    -- Als de status niet 'Open' is, voeg dan ook een status-update toe als recente activiteit
    IF v_status != 'Open' THEN
      INSERT INTO task_history (task_id, user_id, action, created_at)
      VALUES (
        v_task_id,
        v_user_id,
        'Status naar ''' || v_status || '''',
        CURRENT_TIMESTAMP - (floor(random() * 24) || ' hours')::interval
      );
    END IF;
  END LOOP;
END $$;
