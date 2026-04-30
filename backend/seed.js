require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('./src/models/user.model');
const accountModel = require('./src/models/account.model');
const transactionModel = require('./src/models/transaction.model');
const ledgerModel = require('./src/models/ledger.model');
const transactionService = require('./src/services/transaction.service');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Database');

        // Clear existing data (dropping entire database is safer to bypass constraints)
        await mongoose.connection.db.dropDatabase();
        console.log('Cleared existing database');

        // 1. Create System User (required for initial funds)
        const systemUser = await userModel.create({
            name: 'System Admin',
            email: 'system@bank.com',
            password: 'SystemPassword123!',
            systemUser: true
        });
        const systemAccount = await accountModel.create({
            user: systemUser._id,
            accountType: 'SAVINGS',
            pin: '1234'
        });

        // 2. Create Dummy Users
        const usersData = [
            { name: 'Alice Smith', email: 'alice@example.com', password: 'password123' },
            { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123' },
            { name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123' }
        ];

        const users = await userModel.create(usersData);
        
        // 3. Create Accounts for Users
        const accounts = [];
        for (const user of users) {
            const acc = await accountModel.create({
                user: user._id,
                accountType: 'SAVINGS',
                pin: '1234'
            });
            accounts.push(acc);
        }

        console.log('Created users and accounts');

        // Helper function for manual transaction (bypassing replica-set requirements)
        const createManualTransaction = async (fromAccId, toAccId, amount, idempotencyKey) => {
            const tx = await transactionModel.create({
                fromAccount: fromAccId,
                toAccount: toAccId,
                amount,
                idempotencyKey,
                status: 'COMPLETED'
            });

            await ledgerModel.create([
                { account: fromAccId, amount, transaction: tx._id, type: 'DEBIT' },
                { account: toAccId, amount, transaction: tx._id, type: 'CREDIT' }
            ]);
            return tx;
        };

        // 4. Add Initial Funds to Users
        const initialBalances = [5000, 3000, 1500]; // Alice: 5000, Bob: 3000, Charlie: 1500
        
        for (let i = 0; i < users.length; i++) {
            await createManualTransaction(
                systemAccount._id, 
                accounts[i]._id, 
                initialBalances[i], 
                `init_${Date.now()}_${i}`
            );
        }
        
        console.log('Added initial balances');

        // 5. Create some dummy transactions
        // Alice sends 500 to Bob
        await createManualTransaction(accounts[0]._id, accounts[1]._id, 500, `tx_${Date.now()}_1`);

        // Bob sends 200 to Charlie
        await createManualTransaction(accounts[1]._id, accounts[2]._id, 200, `tx_${Date.now()}_2`);

        // Charlie sends 50 to Alice
        await createManualTransaction(accounts[2]._id, accounts[0]._id, 50, `tx_${Date.now()}_3`);

        console.log('Created transaction history');

        console.log('\n--- SEED COMPLETED SUCCESFULLY ---');
        console.log('\n🔐 User Credentials:');
        usersData.forEach(u => {
            console.log(`Email: ${u.email} | Password: ${u.password}`);
        });

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

seedDatabase();
