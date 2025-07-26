from sqlalchemy import DDL

# Trigger the change in group_expense
expense_function = DDL("""
CREATE OR REPLACE FUNCTION notify_table_update()
RETURNS trigger AS $$
DECLARE
  payload TEXT;
  gid integer;
  group_unique_id TEXT;
BEGIN
  IF (TG_OP = 'DELETE') THEN 
    gid := OLD.group_id;
  ELSE
    gid := NEW.group_id;
  END IF;
                      
  SELECT "group_id" INTO group_unique_id FROM "group" WHERE id = gid;
                                                             
  payload := json_build_object(
    'table', TG_TABLE_NAME,
    'action', TG_OP,
    'data', group_unique_id
  )::text;
                      
  PERFORM pg_notify('table_updates', payload);
                      
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
""")

expense_trigger = DDL("""
  DROP TRIGGER IF EXISTS on_group_expenses_change ON group_expenses;
  CREATE TRIGGER on_group_expenses_change
  AFTER INSERT OR UPDATE OR DELETE
  ON group_expenses
  FOR EACH ROW
  EXECUTE FUNCTION notify_table_update();
""")

members_trigger = DDL("""
  DROP TRIGGER IF EXISTS on_group_members_change ON group_members;
  CREATE TRIGGER on_group_members_change
  AFTER INSERT OR UPDATE OR DELETE
  ON group_members
  FOR EACH ROW
  EXECUTE FUNCTION notify_table_update();
""")

# Function to execute both
def create_triggers(engine):
    with engine.begin() as conn:
        conn.execute(expense_function)
        conn.execute(expense_trigger)
        conn.execute(members_trigger)
      
