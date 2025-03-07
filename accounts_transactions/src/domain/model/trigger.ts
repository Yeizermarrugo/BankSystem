import db from "../utils/database";

async function createTriggers() {
	await db.query(`
        DROP TRIGGER IF EXISTS trigger_actualizar_saldo ON transactions;
        DROP FUNCTION IF EXISTS actualizar_saldo();
        -- Espera un poco para asegurarse de que el trigger y función se eliminen correctamente.
    `);

	setTimeout(async () => {
		await db.query(`
            CREATE OR REPLACE FUNCTION actualizar_saldo()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW."tipo" = 'ingreso' THEN
                    UPDATE accounts SET saldo = saldo + NEW."monto" WHERE id = NEW."accountId";
                ELSIF NEW."tipo" = 'egreso' THEN
                    UPDATE accounts SET saldo = saldo - NEW."monto" WHERE id = NEW."accountId";
                END IF;
    
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
    
            CREATE TRIGGER trigger_actualizar_saldo
            AFTER INSERT ON transactions
            FOR EACH ROW
            EXECUTE FUNCTION actualizar_saldo();
        `);
	}, 500);
}

export default createTriggers;
