import { connect, disconnect } from 'mongoose';
async function connectToDatabase() {
    try {
        connect(process.env.MONGODB_URL);
    }
    catch (error) {
        console.log(error);
        throw new Error('Failed to connect to database');
    }
}
async function disconnectFromDatabase() {
    try {
        await disconnect();
    }
    catch (error) {
        console.log(error);
        throw new Error('Failed to disconnect from database');
    }
}
export { connectToDatabase, disconnectFromDatabase };
// import { connectToDatabase, disconnectFromDatabase } from './db/connection';
//# sourceMappingURL=connection.js.map