module.exports = {
  minArgs: 2, // default 0
  // maxArgs: 3, // default -1 = no limit
  correctSyntax: '{PREFIX}{COMMAND_NAME} <number1> <number2> [number3]', // default null = no syntax

  callback: ({ message , args }) => {
    let sum = 0

    for(const arg of args){
      sum += parseInt(arg)
    }

    if(isNaN(sum)){
      message.reply("Please provide numbers only")
      return
    }
    message.reply(`The sum is ${sum}`)
    
  },
}
