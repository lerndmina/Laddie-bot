const cooldownSchema = require('../models/cooldown-schema')

const cooldownDurations = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
};

const cooldownTypes = ["perUser", "perUserPerGuild", "perGuild", "global"];

class Cooldowns {
  // actionID = commandNAME or buttonNAME etc

  // perUser
  // <`${userId}-${actionID}`: expires>

  // perUserPerGuild
  // <`${userId}-${guildID}-${actionID}`: expires>

  // perGuild
  // global
  // <action: expires>
  _cooldowns = new Map();

  constructor({
    instance,
    errorMessage = `Please wait {TIME} before trying that again.`,
    botOwnersBypass = false,
    dbRequired = 300, // in seconds / 5 mins
  }) {
    this._instance = instance;
    this._errorMessage = errorMessage;
    this._botOwnersBypass = botOwnersBypass;
    this._dbRequired = dbRequired;

    this.loadCooldowns();
  }

  async loadCooldowns() {
    const deleteRequest = await cooldownSchema.deleteMany({ expires: {$lt: new Date()} })

    const results = await cooldownSchema.find({})
    for (const result of results) {
        const { _id: key, expires } = result

        this._cooldowns.set(key, expires) 
    }

    console.log(`Loaded ${this._cooldowns.size} cooldowns from the database.`)
    console.log(`Deleted ${deleteRequest.deletedCount} expired cooldowns.`)
  }

  getKeyFromCooldownUsage(cooldownUsage){
    const { cooldownType, userID, actionID, guildID} = cooldownUsage

    return this.getCooldownKey(cooldownType, userID, actionID, guildID)
  }

  async cancelCooldown(cooldownUsage) {
    const key = this.getKeyFromCooldownUsage(cooldownUsage)

    this._cooldowns.delete(key)
    await cooldownSchema.deleteOne({ _id: key })
  }

  async updateCooldown(cooldownUsage, expires){
    const key = this.getKeyFromCooldownUsage(cooldownUsage)

    this._cooldowns.set(key, expires)

    const now = new Date()
    const secondsDiff = (expires.getTime() - now.getTime()) / 1000
    if(secondsDiff >= this._dbRequired){
       await cooldownSchema.findOneAndUpdate(
      {
          _id: key,

      },
      {
          _id: key,
          expires,
      },
      {
          upsert: true,
          // update
          // and insert
      }
    ) 
    }    
  }

  getCooldownSeconds(duration) {
    if (typeof duration === "number") {
      return duration;
    }

    const split = duration.split(" ");

    if (split.length !== 2) {
      throw new Error(
        `Invalid cooldown duration: ${duration} - must be in the format of "10 s" or "5 m" or "1 h" or "1 d"`
      );
    }

    const time = parseInt(split[0]);
    const type = split[1].toLowerCase();
    if (!cooldownDurations[type]) {
      throw new Error(
        `Invalid cooldown duration type: ${type} - must be one of: ${Object.keys(
          cooldownDurations
        ).join(", ")}`
      );
    }

    if (time <= 0) {
      throw new Error(
        `Invalid cooldown time: ${time} - must be a positive number`
      );
    }

    return time * cooldownDurations[type];
  }

  getCooldownKey(cooldownType, userID, actionID, guildID) {
    const isPerUser = cooldownType === cooldownTypes[0];
    const isPerUserPerGuild = cooldownType === cooldownTypes[1];
    const isPerGuild = cooldownType === cooldownTypes[2];
    const isGlobal = cooldownType === cooldownTypes[3];

    if ((isPerUserPerGuild || isPerGuild) && !guildID) {
      throw new Error(
        `Cooldown type "${cooldownType}" cannot be run outside a guild.`
      );
    }

    if (isPerUser) {
      return `${userID}-${actionID}`;
    }
    if (isPerUserPerGuild) {
      return `${userID}-${guildID}-${actionID}`;
    }
    if (isPerGuild) {
      return `${guildID}-${actionID}`;
    }
    if (isGlobal) {
      return actionID;
    }
  }
  canBypassCooldown(userID) {
    return this._botOwnersBypass && this._instance._botOwners.includes(userID);
  }

  async startCooldown({ cooldownType, userID, actionID, guildID = "", duration }) {
    if (this.canBypassCooldown(userID)) {
      return;
    }

    if (!cooldownTypes.includes(cooldownType)) {
      throw new Error(
        `Invalid cooldown type: ${cooldownType} - must be one of: ${cooldownTypes.join(
          ", "
        )}`
      );
    }

    const key = this.getCooldownKey(cooldownType, userID, actionID, guildID)
    const expires = new Date()

    this._cooldowns.set(key, expires)

    const seconds = this.getCooldownSeconds(duration)
    expires.setSeconds(expires.getSeconds() + seconds)

    if (seconds >= this._dbRequired) {
      await cooldownSchema.findOneAndUpdate(
        {
            _id: key,

        },
        {
            _id: key,
            expires,
        },
        {
            upsert: true,
            // update
            // and insert
        }
      )
    }

    

    // console.log(this._cooldowns);
  }

  canRunAction({
    cooldownType,
    userID,
    actionID,
    guildID = "",
    errorMessage = this._errorMessage,
  }) {
    if (this.canBypassCooldown(userID)) {
      return true;
    }

    const key = this.getCooldownKey(cooldownType, userID, actionID, guildID);
    const expires = this._cooldowns.get(key);

    if (!expires) {
      return true;
    }

    const now = new Date();
    if (now > expires) {
      this._cooldowns.delete(key);
      return true;
    }

    const secondsDiff = Math.ceil((expires - now) / 1000);
    const d = Math.floor(secondsDiff / (3600 * 24));
    const h = Math.floor((secondsDiff % (3600 * 24)) / 3600);
    const m = Math.floor((secondsDiff % 3600) / 60);
    const s = Math.floor(secondsDiff % 60);

    let time = "";
    if (d > 0) time += `${d}d `;
    if (h > 0) time += `${h}h `;
    if (m > 0) time += `${m}m `;
    time += `${s}s`;

    return errorMessage.replace("{TIME}", time);
  }
}
module.exports = Cooldowns;
module.exports.cooldownTypes = cooldownTypes;
