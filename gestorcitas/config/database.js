const mssql = require('mssql');

const config = {
    user: 'sa',
    password: 'postgres',
    server: '127.0.0.1',
    database: 'gestorcitas',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        trustedConnection: false
    }
};

let poolPromise;

async function getPool() {
    if (!poolPromise) {
        poolPromise = mssql.connect(config).catch(error => {
            poolPromise = null;
            throw error;
        });
    }
    return poolPromise;
}

module.exports = {
    query: async (text, params = []) => {
        try {
            const pool = await getPool();
            const request = pool.request();
            let sql = text;

            params.forEach((param, index) => {
                const paramName = `p${index + 1}`;
                request.input(paramName, param);
                const regex = new RegExp(`\\$${index + 1}(?!\\d)`, 'g');
                sql = sql.replace(regex, `@${paramName}`);
            });

            const result = await request.query(sql);
            return { rows: result.recordset || [] };
        } catch (error) {
            console.error('Error en la consulta SQL:', error);
            throw error;
        }
    }
};
