module.exports = (message, interaction, text, deffered = false) => {
  if(message){
    message.reply(text)
  } else if (interaction){
    if (deffered !== false) {
      interaction.editReply(text)
    } else {
      interaction.reply(text)
    }
  }
}