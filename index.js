const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const DATA_FILE = './robux_balance.json';
const PREFIX = '$';

function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    return {};
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
}

client.once('ready', () => {
    console.log(`تم تشغيل البوت بنجاح: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // كوماند إضافة الروبكس: $add @شخص 100
    if (command === 'add') {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ هذا الأمر للمشرفين فقط!');
        }

        const member = message.mentions.members.first();
        const amount = parseInt(args[1]); 

        if (!member || isNaN(amount) || amount <= 0) {
            return message.reply('❌ الطريقة الصحيحة: `$add @اسم_الشخص 100`');
        }

        let data = loadData();
        const userId = member.id;

        if (data[userId]) {
            data[userId].balance += amount;
        } else {
            data[userId] = { name: member.user.username, balance: amount };
        }

        saveData(data);
        message.reply(`✅ تم إضافة **${amount}** روبكس إلى حساب ${member}. رصيده الحالي: **${data[userId].balance}** روبكس.`);
    }

    // كوماند فحص الرصيد: $balance
    if (command === 'balance') {
        const member = message.mentions.members.first() || message.member;
        let data = loadData();
        const userId = member.id;
        const balance = data[userId] ? data[userId].balance : 0;

        message.reply(`💳 رصيد ${member} الحالي هو: **${balance}** روبكس.`);
    }
});

// تذكر استبدال TOKEN_HERE بتوكن البوت الخاص بك لاحقاً ليعمل
clienclient.login('TOKEN_HERE');
