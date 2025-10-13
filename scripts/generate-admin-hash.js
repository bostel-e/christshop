const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Générateur de Hash pour Mot de Passe Admin\n');

rl.question('Entrez le mot de passe admin souhaité: ', (password) => {
  if (password.length < 8) {
    console.error('\n❌ Le mot de passe doit contenir au moins 8 caractères');
    rl.close();
    return;
  }

  console.log('\n⏳ Génération du hash...');
  
  const hash = bcrypt.hashSync(password, 10);
  
  console.log('\n✅ Hash généré avec succès!\n');
  console.log('Copiez cette ligne dans votre fichier .env:');
  console.log('─'.repeat(60));
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('─'.repeat(60));
  console.log('\n💡 Conseils de sécurité:');
  console.log('   • Utilisez un mot de passe fort (12+ caractères)');
  console.log('   • Mélangez majuscules, minuscules, chiffres et symboles');
  console.log('   • Ne partagez jamais ce mot de passe');
  console.log('   • Changez-le régulièrement en production\n');
  
  rl.close();
});
