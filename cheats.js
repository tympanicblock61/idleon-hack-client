const cheats = {}
var mainDone = false
var proxyDone = false
var events = []
var keybinds = []
const cheatState = {
	cloudz:		false,
	runescape: 	false,
	godlikes: false,
	godlike: {
		crit: 		false,
		reach:		false,
		hp:			false,
		mp:			false,
		ability:	false,
		bosshp:		false,
		food: 		false,
		hitchance:	false,
		dmg:		false,
		buff:		false,
	},
	unlocks: false,
	unlock: {
		teleports:	false,
		quickref:	false,
		tickets:	false,
		silvpen:	false,
		goldpen:	false,
		obolfrag:	false,
		revive:		false,
	},
	wides: false,
	wide: {
		mtx: 		false,
		post:		false,
		guild:		false,
		task:		false,
		quest:		false,
		star:		false,
		crystal: 	false,
		giant: 		false,
		obol:		false,
	},
	W1s: false,
	W1: {
		stampcost: false, 
		anvil: 		false, 
		forge: 		false, 
		smith: 		false,
		statue: 	false,
	},
	cauldrons: false,
	cauldron: {
		vialrng:		false,
		vialattempt: 	false,
		bubblecost:		false,
		vialcost: 		false,
		lvlreq: 		false,
		newbubble: 		false,
		re_speed:		false,
		liq_rate:		false,
	},
	W3s: false,
	W3: {
		mobdeath: 	false,
		flagreq:	false,
		saltcost:	false,
		matcost:	false,
		instabuild:	false,
		booktime:	false,
		totalflags:	false,
		buildspd:	false,
		saltlick:	false,
		refinery: 	false,
		trapping:	false,
		book:		false,
		prayer:		false,
		shrinehr:	false,
	},
	minigames: false,
	minigame: {
		mining: 	false,
		catching: 	false,
		fishing: 	false,
		choppin: 	false,
	},
	Console: false,
	showmapinfo: false,
    globalchar: false
}
window.onload = function() {
	while (true) {
		try {
			if (!mainDone) main.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__)
			break
		}
		catch {
	
		}
	}
    setInterval(function() {if (!proxyDone) try{proxys.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__); console.log("Finished loading proxys")} catch(e) {}}, 10000)
}

function ChangeND(bEng, dim, KeyName, repl, elem){
	var NDArr
	if(typeof KeyName === "string") // Creates a deep-copy
		NDArr = JSON.parse(JSON.stringify(bEng.getGameAttribute("CustomLists").h[KeyName]))
	else NDArr = KeyName // Else this KeyName parameter is an object
	if(dim === 4){
		for(const [index1, element1] of Object.entries(NDArr)){
			for(const [index2, element2] of Object.entries(element1)){
				for(const [index3, element3] of Object.entries(element2)){
					for(i in elem) element3[elem[i]] = repl	// Fill every
					NDArr[index1][index2][index3] = element3 	// Write back to the 4D Array
				}
			}
		}
	} else if(dim === 3){
		for(const [index1, element1] of Object.entries(NDArr)){
			for(const [index2, element2] of Object.entries(element1)){
				for(i in elem) element2[elem[i]] = repl
				NDArr[index1][index2] = element2 // Write back to the 3D Array
			}
		}
	} else if(dim === 2){
		for(const [index1, element1] of Object.entries(NDArr)){
			for(i in elem) element1[elem[i]] = repl
			NDArr[index1] = element1 // Write back to the 2D Array
		}
	} else return NDArr // Else return the original without modifications
	return NDArr
}
function proxys() {
    function setupOptionsListAccountProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const optionsListAccount = bEngine.getGameAttribute("OptionsListAccount")
        const handler = {
            get: function(obj, prop) {
                if ((cheatState.unlocks || cheatState.unlock.quickref) && Number(prop) === 34) return 0
                if (cheatState.minigames && Number(prop) === 33) return obj[33] || 1
                return Reflect.get(...arguments)
            },
            set: function(obj, prop, value) {
                if (cheatState.minigames && Number(prop) === 33) {
                    if (obj[33] < value) obj[33] = value
                    return true
                } return Reflect.set(...arguments)
            }
        }
        const proxy = new Proxy(optionsListAccount, handler)
        bEngine.setGameAttribute("OptionsListAccount", proxy)
    }
    function setupValuesMapProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const CurrenciesOwned = bEngine.getGameAttribute("PersonalValuesMap").h
        const handler = {
            get: function(obj, prop) {
                if ((cheatState.unlocks || cheatState.unlock.revive) && prop === "InstaRevives") return obj.InstaRevives || 1
                return Reflect.get(...arguments)
            },
            set: function(obj, prop, value) {
                if ((cheatState.unlocks || cheatState.unlock.revive) && prop === "InstaRevives"){
                    if (obj["InstaRevives"] < value) obj["InstaRevives"] = value
                    return true
                } return Reflect.set(...arguments)
            }
        }
        const proxy = new Proxy(CurrenciesOwned, handler)
        bEngine.getGameAttribute("PersonalValuesMap").h = proxy
    }
    function setupBuffsActiveProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const BuffsActive = bEngine.getGameAttribute("BuffsActive")
        const handler = {
            get: function(obj, prop) {
                if ((cheatState.godlikes || cheatState.godlike.buff) && typeof obj[prop][1] != "undefined") obj[prop][1] = 5 // Trap at 5 seconds left
                return Reflect.get(...arguments)
            },
            set: function(obj, prop, value) {
                if ((cheatState.godlikes || cheatState.godlike.buff) && typeof obj[prop][1] != "undefined"){
                    obj[prop][1] = 5
                    return true
                } return Reflect.set(...arguments)
            }
        }
        const proxy = new Proxy(BuffsActive, handler)
        bEngine.setGameAttribute("BuffsActive", proxy)
    }
    function setupCloudSaveProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const CloudSave = bEngine.getGameAttribute("CloudSaveCD")
        const handler = {
            get: function(obj, prop) {
                if (cheatState.cloudz && Number(prop) === 0) return 235
                return Reflect.get(...arguments)
            },
            set: function(obj, prop, value) {
                if (cheatState.cloudz && Number(prop) === 0){
                    obj[0] = 235
                    return true
                } return Reflect.set(...arguments)
            }
        }
        const proxy = new Proxy(CloudSave, handler)
        bEngine.setGameAttribute("CloudSaveCD", proxy)
        
    }
    function setupChangeMapProxy() {
        var ChangeMapfuncs = []
        var calls = 0
        const bEngine = this["com.stencyl.Engine"].engine
        bEngine.enterScene = new Proxy(bEngine.enterScene, {
            apply: function (originalFn, context, argumentsList) {
                var oldMap = bEngine.getGameAttribute("CurrentMap")
                var Chat = bEngine.getGameAttribute("Chat").h
                Reflect.apply(originalFn, context, argumentsList)
                if (cheatState.showmapinfo) {
                    var newMap = bEngine.getGameAttribute("CurrentMap")
                    calls += 1
                    ChnlInChat = false
                    console.log(`${newMap}, ${oldMap}`)
                    console.log(ChangeMapfuncs)
                    console.log(calls)
                    console.log(!cheatState.Console)
                    console.log(JSON.stringify(Chat))
                    Chat["Console"].push(["Console", `${newMap}, ${oldMap}`])
                    Chat["Console"].push(["Console", ChangeMapfuncs])
                    Chat["Console"].push(["Console", calls])
                    Chat["Console"].push(["Console", !cheatState.Console])
                }
            }
        })
    }
    function setupGameAttrProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const gameAttr = bEngine.gameAttributes.h
        const handler = {
            get: function(obj, prop) {
                if((cheatState.godlikes || cheatState.godlike.hp) && prop === "PlayerHP") return obj.PlayerHP || 1
                if((cheatState.godlikes || cheatState.godlike.mp) && prop === "PlayerMP") return obj.PlayerMP || 1
                if((cheatState.godlikes || cheatState.godlike.bosshp) && prop === "BossHP") return 0
                return Reflect.get(...arguments)
            },
            set: function(obj, prop, value) {
                if((cheatState.godlikes || cheatState.godlike.hp) && prop === "PlayerHP"){ if (obj.PlayerHP < value) obj.PlayerHP = value; return true } 
                if((cheatState.godlikes || cheatState.godlike.mp) && prop === "PlayerMP"){ if (obj.PlayerMP < value) obj.PlayerMP = value; return true }
                if((cheatState.godlikes || cheatState.godlike.bosshp) && prop === "BossHP"){ if (obj.BossHP < 0) obj.BossHP = 0; return true }
                return Reflect.set(...arguments)
            }
        }
        const proxy = new Proxy(gameAttr, handler)
        bEngine.gameAttributes.h = proxy
    }
    function setupArbitraryProxy(){
        const ActorEvents12 = this["scripts.ActorEvents_12"]
        // 100% crit chance
        const CritChance = ActorEvents12._customBlock_CritChance
        const handlerCrit = {
            apply: function(originalFn, context, argumentsList) {
                if (cheatState.godlike.dmg) return 0 // Disable crits on dmg cap, as it's already capped
                if (cheatState.godlikes || cheatState.godlike.crit) return 100
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyCrit = new Proxy(CritChance, handlerCrit)
        ActorEvents12._customBlock_CritChance = proxyCrit
        // Reach to 230
        const atkReach = ActorEvents12._customBlock_PlayerReach
        const handlerReach = {
            apply: function(originalFn, context, argumentsList) {
                if (cheatState.godlikes || cheatState.godlike.reach) return 666
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyReach = new Proxy(atkReach, handlerReach)
        ActorEvents12._customBlock_PlayerReach = proxyReach
        // Free forge upgrades
        const forgeupgr = ActorEvents12._customBlock_ForgeUpdateCosts
        const handlerForge = {
            apply: function(originalFn, context, argumentsList) {
                if (cheatState.W1s || cheatState.W1.forge) return 0
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyForge = new Proxy(forgeupgr, handlerForge)
        ActorEvents12._customBlock_ForgeUpdateCosts = proxyForge
        // Imperfect damage cap on too-OP broken players with overflowing damage
        const DamageDealt = ActorEvents12._customBlock_DamageDealed
        const handlerDamage = {
            apply: function(originalFn, context, argumentsList) {
                const t = argumentsList[0]
                if (cheatState.godlike.dmg && t == "Min") return Number.MAX_SAFE_INTEGER
                if (cheatState.godlike.dmg && t == "Max") return Number.MAX_SAFE_INTEGER
                if (cheatState.godlike.dmg && t == "RNG") return Number.MAX_SAFE_INTEGER
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyDamage = new Proxy(DamageDealt, handlerDamage)
        ActorEvents12._customBlock_DamageDealed = proxyDamage
        // Some arbitrary stuff
        const Arbitrary = ActorEvents12._customBlock_ArbitraryCode
        const handlerArbitrary = {
            apply: function(originalFn, context, argumentsList) {
                const t = argumentsList[0]
                // if (cheatState.W1.statue && t.substring(0, 12) == "StatueExpReq") return 1 	// This cheat works, but absolutely destroys your account
                if ((cheatState.wides 		|| cheatState.wide.crystal) 		&& t == "CrystalSpawn")		return 1 	// Crystal mob spawn rate 1
                if ((cheatState.wides 		|| cheatState.wide.giant) 			&& t == "GiantMob")			return 1 	// Giant mob spawn rate 1
                if ((cheatState.godlikes 	|| cheatState.godlike.food) 		&& t == "FoodNOTconsume")	return 100 // Food never consumed
                if ((cheatState.godlikes 	|| cheatState.godlike.hitchance) 	&& t == "HitChancePCT")		return 100 // 100% hit chance
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyArbitrary = new Proxy(Arbitrary, handlerArbitrary)
        ActorEvents12._customBlock_ArbitraryCode = proxyArbitrary
    
        const XforThingY = ActorEvents12._customBlock_RunCodeOfTypeXforThingY
        const handlerXforThingY = {
            apply: function(originalFn, context, argumentsList) {
                const t = argumentsList[0]
                if ((cheatState.wides || cheatState.wide.obol) && t == "ObolRerollCostMoney") 	return 0
                if ((cheatState.wides || cheatState.wide.obol) && t == "ObolRerollCostFrag") 	return 0
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyXforThingY = new Proxy(XforThingY, handlerXforThingY)
        ActorEvents12._customBlock_RunCodeOfTypeXforThingY = proxyXforThingY
    }
    function setupCurrenciesOwnedProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const currencies = bEngine.getGameAttribute("CurrenciesOwned").h
        const handler = {
            get: function(obj, prop) {
                if ((cheatState.unlocks || cheatState.unlock.teleports) && prop === 'WorldTeleports') 	return obj.WorldTeleports || 1
                if ((cheatState.unlocks || cheatState.unlock.tickets) 	&& prop === 'ColosseumTickets') return obj.ColosseumTickets || 1
                if ((cheatState.unlocks || cheatState.unlock.obolfrag) 	&& prop === 'ObolFragments') 	return obj.ObolFragments || 9001 // It's over nine thousand
                if ((cheatState.unlocks || cheatState.unlock.silvpen) 	&& prop === 'SilverPens') 		return obj.SilverPens || 1
                // Not a safe cheat as golden pens aren't released yet,
                // Only for people that use the manual cheat: chng bEngine.getGameAttribute("CurrenciesOwned").h["GoldPens"]=100
                //if ((cheatState.unlocks || cheatState.unlock.goldpen) 	&& prop === 'GoldPens') 		return obj.GoldPens || 1
                return Reflect.get(...arguments)
            },
            set: function(obj, prop, value) {
                if ((cheatState.unlocks || cheatState.unlock.teleports) && prop === 'WorldTeleports') 	return true // Do nothing
                if ((cheatState.unlocks || cheatState.unlock.tickets) 	&& prop === 'ColosseumTickets') { 
                    if (obj.ColosseumTickets < value) obj.ColosseumTickets = value 
                    return true 
                } if ((cheatState.unlocks || cheatState.unlock.silvpen) && prop === 'SilverPens') { 
                    if(obj.SilverPens < value) obj.SilverPens = value 
                    return true 
                } if ((cheatState.unlocks || cheatState.unlock.GoldPens) && prop === 'GoldPens') { 
                    if(obj.GoldPens < value) obj.GoldPens = value 
                    return true 
                } if ((cheatState.unlocks || cheatState.unlock.obolfrag) && prop === 'ObolFragments') { 
                    if(obj.ObolFragments < value) obj.ObolFragments = value 
                    return true 
                } return Reflect.set(...arguments)
            }
        }
        const proxy = new Proxy(currencies, handler)
        bEngine.getGameAttribute("CurrenciesOwned").h = proxy
    }
    function setupStampCostProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const actorEvents124 = this["scripts.ActorEvents_124"]
        const stampCostFn = actorEvents124._customBlock_StampCostss
        const handler = {
            apply: function(originalFn, context, argumentsList) {
                if (cheatState.W1s || cheatState.W1.stampcost) {
                    const tab = argumentsList[0]
                    const index = argumentsList[1]
                    const currentStampLevel = bEngine.getGameAttribute("StampLevel")[tab][index]
                    const maxStampLevel = bEngine.getGameAttribute("StampLevelMAX")[tab][index]
                    if (currentStampLevel < maxStampLevel) return ['Money', 0]
                    return ['PremiumGem', 0]
                } return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxy = new Proxy(stampCostFn, handler)
        actorEvents124._customBlock_StampCostss = proxy
    }
    function setupAnvilProxy() {
        const ActorEvents189 = this["scripts.ActorEvents_189"]
        const _AnvilProduceStats = ActorEvents189._customBlock_AnvilProduceStats
        const handler = {
            apply: function(originalFn, context, argumentsList) {
                if (cheatState.W1s || cheatState.W1.anvil) {
                    const t = argumentsList[0]
                    if (t == "Costs1") 			return 0
                    if (t == "Costs2") 			return 0
                    if (t == "ProductionSpeed") return 1000000
                    else return Reflect.apply(originalFn, context, argumentsList)
                } return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxy = new Proxy(_AnvilProduceStats, handler)
        ActorEvents189._customBlock_AnvilProduceStats = proxy
    }
    function setupAbilityProxy() {
        const CustomMaps = this["scripts.CustomMaps"]
        const atkMoveMap = JSON.parse(JSON.stringify(this["scripts.CustomMaps"].atkMoveMap.h))
        for(const [key, value] of Object.entries(atkMoveMap)){
            value.h["cooldown"] = 0
            value.h["castTime"] = .1
            value.h["manaCost"] = 0
            atkMoveMap[key] = value
        }
        const handler = {
            get: function(obj, prop) {
                if(cheatState.godlikes || cheatState.godlike.ability) return atkMoveMap[prop]
                return Reflect.get(...arguments)
            }
        }
        const proxy = new Proxy(CustomMaps.atkMoveMap.h, handler)
        CustomMaps.atkMoveMap.h = proxy
    }
    function setupSmithProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const sizeref = bEngine.getGameAttribute("CustomLists").h["ItemToCraftEXP"]
        const tCustomList = this["scripts.CustomLists"]
    
        const NewReqs = [] // This'll be the new Array where we write our stuff to
        const size = [] // Time to obtain the Array lengths (e.g. amount of items per smithing tab)
        for(const [index, element] of Object.entries(sizeref)) size.push(element.length)
        // Yup we're using double square brackets, cause each item could require multiple materials to craft, while we only need to fill in one
        for(i=0; i < size.length; i++) NewReqs.push(new Array(size[i]).fill([["Copper", "0"]]))
        const handler = {
            apply: function(originalFn, context, argumentsList) {
                if (cheatState.W1s || cheatState.W1.smith) return NewReqs
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxy = new Proxy(tCustomList["ItemToCraftCostTYPE"], handler)
        tCustomList["ItemToCraftCostTYPE"] = proxy
    }
    function setupCListProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const CList = bEngine.getGameAttribute("CustomLists").h
    
        const FuncDict = {
            AlchemyVialItemsPCT:		new Array(CList.AlchemyVialItemsPCT.length).fill(99),					// Vials unlock at rollin 1+
            SaltLicks:					ChangeND(bEngine,2,"SaltLicks","0",[2]),								// Nullify Saltlick upgrade cost
            RefineryInfo:				ChangeND(bEngine,2,"RefineryInfo","0",[6,7,8,9,10,11]),					// Nullify refinery cost
            TrapBoxInfo:				ChangeND(bEngine,3,"TrapBoxInfo","0", [0]),								// Nullify trapping time
            PrayerInfo:					ChangeND(bEngine,2,														// Nullify Prayer Curses and upgrade cost
                                            ChangeND(bEngine,2,"PrayerInfo","0",[4,6]),
                                            "None._Even_curses_need_time_off_every_now_and_then.",[2]),
            MTXinfo:					ChangeND(bEngine,4,"MTXinfo",0,[3,7]),									// Nullify MTX cost
            PostOfficePossibleOrders:	ChangeND(bEngine,4,"PostOfficePossibleOrders","0",[1]),					// Nullify post office order cost
            GuildGPtasks:				ChangeND(bEngine,2,"GuildGPtasks","0",[1]),								// Nullify guild task requirements
            TaskDescriptions:			ChangeND(bEngine,3,"TaskDescriptions","0",[5,6,7,8,9,10,11,12,13,14]),	// Nullify task requirements
            SSignInfoUI:				ChangeND(bEngine,2,"SSignInfoUI","0",[4]) 								// Nullify star sign unlock req
        }
        const handler = {
            get: function(obj, prop) {
                if ((cheatState.cauldrons || cheatState.cauldron.vialrng) 	&& prop === "AlchemyVialItemsPCT") 		return FuncDict[prop]
                if ((cheatState.W3s || cheatState.W3.saltlick) 				&& prop === "SaltLicks") 				return FuncDict[prop]
                if ((cheatState.W3s || cheatState.W3.refinery) 				&& prop === "RefineryInfo") 			return FuncDict[prop]
                if ((cheatState.W3s || cheatState.W3.trapping) 				&& prop === "TrapBoxInfo") 				return FuncDict[prop]
                if ((cheatState.W3s || cheatState.W3.prayer) 				&& prop === "PrayerInfo") 				return FuncDict[prop]
                if ((cheatState.wides || cheatState.wide.mtx) 				&& prop === "MTXinfo") 					return FuncDict[prop]
                if ((cheatState.wides || cheatState.wide.post) 				&& prop === "PostOfficePossibleOrders") return FuncDict[prop]
                if ((cheatState.wides || cheatState.wide.guild) 			&& prop === "GuildGPtasks") 			return FuncDict[prop]
                if ((cheatState.wides || cheatState.wide.task) 				&& prop === "TaskDescriptions") 		return FuncDict[prop]
                if ((cheatState.wides || cheatState.wide.star) 				&& prop === "SSignInfoUI") 				return FuncDict[prop]
                return Reflect.get(...arguments)
            }
        }
        const proxy = new Proxy(CList, handler)
        bEngine.getGameAttribute("CustomLists").h = proxy
    }
    function setupQuestProxy() {
        const dialogueDefs = this["scripts.DialogueDefinitions"]
        const dialogueDefsC = JSON.parse(JSON.stringify( this["scripts.DialogueDefinitions"].dialogueDefs.h ))
        for(const [key, value] of Object.entries(dialogueDefsC)) 	// Go over all the quest-giving NPCs
            for(i=0; i < value[1].length; i++) 						// Go over all the addLine elements of that NPC
                // Notice that inside each value (e.g. NPC object), the 1st element is where all numeric stuff reside.
                // The 0th element holds the textual dialogue, which is not what we're looking for
                if(value[1][i].length == 9){ 						// Both addLine_ItemsAndSpaceRequired and addLine_Custom have nine elements within
                    // Iterate over an unknown amount of req. values/Arrays
                    if(value[1][i][2] === value[1][i][8]) 			// This is addLine_Custom
                        for(j=0; j < value[1][i][3].length; j++){
                            dialogueDefsC[key][1][i][3][j][1] = 0
                            dialogueDefsC[key][1][i][3][j][3] = 0
                        }
                    else for(j=0; j < value[1][i][3].length; j++) 	// This is addLine_ItemsAndSpaceRequired
                        dialogueDefsC[key][1][i][3][j] = 0
                }
        const handler = {
            get: function(obj, prop) {
                if (cheatState.wides || cheatState.wide.quest) return dialogueDefsC[prop]
                return Reflect.get(...arguments)
            }
        }
        const proxy = new Proxy(dialogueDefs.dialogueDefs.h, handler)
        dialogueDefs.dialogueDefs.h = proxy
    }
    function setupAlchProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const ActorEvents189 = this["scripts.ActorEvents_189"]
        // No vial attempt reduction
        const CauldronP2W = bEngine.getGameAttribute("CauldronP2W")
        const handlerP2W = {
            get: function(obj, prop) {
                if ((cheatState.cauldron.vialattempt || cheatState.cauldrons) && obj[5][0] < obj[5][1]) {
                    obj[5][0] = obj[5][1]
                    return obj
                } return Reflect.get(...arguments)
            }
        }
        const proxyP2W = new Proxy(CauldronP2W, handlerP2W)
        bEngine.setGameAttribute("CauldronP2W", proxyP2W)
        // Nullify all cauldron costs and durations (except P2W)
        const CauldronStats = ActorEvents189._customBlock_CauldronStats
        const handlerStats = {
            apply: function(originalFn, context, argumentsList) {
                const t = argumentsList[0]
                if ((cheatState.cauldrons || cheatState.cauldron.bubblecost) 	&& t == "CauldronCosts") 		return 0 		// Nullified cauldron cost
                if ((cheatState.cauldrons || cheatState.cauldron.vialcost) 		&& t == "VialCosts")			return 0 		// Nullified vial cost
                if ((cheatState.cauldrons || cheatState.cauldron.lvlreq) 		&& t == "CauldronLvsBrewREQ")	return 0 		// Nullified brew reqs
                if ((cheatState.cauldrons || cheatState.cauldron.newbubble) 	&& t == "PctChanceNewBubble")	return 1000000 // Big enough new bubble chance
                if ((cheatState.cauldrons || cheatState.cauldron.re_speed) 		&& t == "ResearchSpeed")		return 10000 	// Instant research speed
                if ((cheatState.cauldrons || cheatState.cauldron.liq_rate) 		&& t == "LiquidHRrate")			return 10000 	// Quick liquid
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyStats = new Proxy(CauldronStats, handlerStats)
        ActorEvents189._customBlock_CauldronStats = proxyStats
    }
    function setupW3StuffProxy() {
        const actorEvents345 = this["scripts.ActorEvents_345"]
        // Nullification of all costs inside the workbench
        const WorkbenchStuff = actorEvents345._customBlock_WorkbenchStuff
        const handlerWb = {
            apply: function(originalFn, context, argumentsList) {
                const t = argumentsList[0]
                if ((cheatState.W3s || cheatState.W3.flagreq) 		&& t == "FlagReq") 			return 0 		// Nullified flag unlock time
                if ((cheatState.W3s || cheatState.W3.saltcost) 		&& t == "TowerSaltCost")	return 0 		// Partial Tower cost nullification
                if ((cheatState.W3s || cheatState.W3.matcost) 		&& t == "TowerMatCost")		return 0 		// Partial Tower cost nullification
                if ((cheatState.W3s || cheatState.W3.instabuild) 	&& t == "TowerBuildReq")	return 0 		// Instant build/upgrade
                if ((cheatState.W3s || cheatState.W3.booktime) 		&& t == "BookReqTime")		return 1 		// Book/second, holds shadow ban danger and could one day be replaced
                if ((cheatState.W3s || cheatState.W3.totalflags) 	&& t == "TotalFlags")		return 10 		// Total amnt of placeable flags
                if ((cheatState.W3s || cheatState.W3.buildspd) 		&& t == "PlayerBuildSpd")	return 1000000 // Buildrate on cogs
                if (cheatState.W3.shrinehr && t == "ShrineHrREQ") return 0.5 // Shrine lvl up time reduced to 0.5 hour
                // The minimum level talent book from the library is equivalent to the max level
                if ((cheatState.W3s || cheatState.W3.book) 			&& t == "minBookLv"){ argumentsList[0] = "maxBookLv"; return Reflect.apply(originalFn, context, argumentsList) }
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyWb = new Proxy(WorkbenchStuff, handlerWb)
        actorEvents345._customBlock_WorkbenchStuff = proxyWb
        // Worship mobs die on spawn
        const _customBlock_2inputsFn = actorEvents345._customBlock_2inputs
        const handlerWs = {
            apply: function(originalFn, context, argumentsList) {
                if (cheatState.W3.mobdeath || cheatState.W3s) 
                    return "Worshipmobdeathi" == true ? 0 : 0
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyWorship = new Proxy(_customBlock_2inputsFn, handlerWs)
        actorEvents345._customBlock_2inputs = proxyWorship
    }
    function setupMinigameProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
    
        const miningGameOver = bEngine.getGameAttribute("PixelHelperActor")[4].getValue('ActorEvents_229', '_customEvent_MiningGameOver')
        const handlerMining = {
            apply: function(originalFn, context, argumentsList) {
                if (cheatState.minigame.mining) return // Do nothing when game over
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyMining = new Proxy(miningGameOver, handlerMining)	
        bEngine.getGameAttribute("PixelHelperActor")[4].setValue('ActorEvents_229', '_customEvent_MiningGameOver', proxyMining)
    
        const fishingGameOver = bEngine.getGameAttribute("PixelHelperActor")[4].getValue('ActorEvents_229', '_customEvent_FishingGameOver')
        const handlerFishing = {
            apply: function(originalFn, context, argumentsList) {
                if (cheatState.minigame.fishing) return // Do nothing when game over
                return Reflect.apply(originalFn, context, argumentsList)
            }
        }
        const proxyFishing = new Proxy(fishingGameOver, handlerFishing)
        bEngine.getGameAttribute("PixelHelperActor")[4].setValue('ActorEvents_229', '_customEvent_FishingGameOver', proxyFishing)
    }
    function setupCatchingMinigameProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
    
        const catchingGameGenInfo = bEngine.getGameAttribute("PixelHelperActor")[4].getValue('ActorEvents_229', '_GenInfo')
        const handler = {
            get: function(originalObject, property) {
                if (cheatState.minigame.catching) {
                    if (Number(property) === 31) return 70
                    if (Number(property) === 33) return [95, 95, 95, 95, 95]
                } return Reflect.get(...arguments)
            }
        }
        const proxyCatching = new Proxy(catchingGameGenInfo, handler)
        bEngine.getGameAttribute("PixelHelperActor")[4].setValue('ActorEvents_229', '_GenInfo', proxyCatching)
    }
    // Chopping minigame: Whole bar filled with gold zone
    function setupGeneralInfoProxy() {
        const bEngine = this["com.stencyl.Engine"].engine
        const generalInfo = bEngine.getGameAttribute("PixelHelperActor")[1].getValue("ActorEvents_116", "_GeneralINFO")
        const handler = {
            get: function(orignalObject, property) {
                if (cheatState.minigame.choppin && Number(property) === 7) 
                    return [100, -1, 0, 2, 0, 220, -1, 0, -1, 0, -1, 0, 0, 220, 0, 0, 1]
                return Reflect.get(...arguments)
            }
        }
        const proxyChopping = new Proxy(generalInfo, handler)
        bEngine.getGameAttribute("PixelHelperActor")[1].setValue("ActorEvents_116", "_GeneralINFO", proxyChopping)
    }
    setupAbilityProxy.call(this)
    setupAlchProxy.call(this)
    setupAnvilProxy.call(this)
    setupArbitraryProxy.call(this)
    setupBuffsActiveProxy.call(this)
    setupCListProxy.call(this)
    setupCatchingMinigameProxy.call(this)
    //setupChangeMapProxy.call(this)
    setupCloudSaveProxy.call(this)
    setupCurrenciesOwnedProxy.call(this)
    setupGameAttrProxy.call(this)
    setupGeneralInfoProxy.call(this)
    setupMinigameProxy.call(this)
    setupOptionsListAccountProxy.call(this)
    setupQuestProxy.call(this)
    setupSmithProxy.call(this)
    setupStampCostProxy.call(this)
    setupValuesMapProxy.call(this)
    setupW3StuffProxy.call(this)
    proxyDone = true
}
function build_button(params) {
    var x = params["x"]
    var y = params["y"]
    var width = params["width"]
    var height = params["height"]
    var button = document.createElement("button")
    button.innerHTML = params["name"]
    if (x < 0) {
         button.style.left = Math.abs(x)+'px'
    }
    if (x > 0) {
         button.style.right = x+'px'
    }
    if (y < 0) {
         button.style.bottom = Math.abs(y)+'px'
    }
    if (y > 0) {
         button.style.top = y+'px'
    }
    if (typeof params["func"] == 'function') {
        if (!params["params"]) {
            button.onclick = function() {params.func.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__)}
        } else {
            button.onclick = function() {params.func.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__, params["params"])}
        }
    }
    if (params["backColor"]) {
        button.style.backgroundColor = params["backColor"]
    }
    if (params["borderColor"]) {
        button.style.borderColor = params["borderColor"]
    }
    if (params["txtColor"]) {
        button.style.color = params["txtColor"]
    }
    if (params["backImage"]) {
        button.style.backgroundImage = `url(${params["backImage"]})`
    }
    if (params["fontSize"]) {
        button.style.fontSize = params["fontSize"]+"px"
    }
    if (params["id"]) {
        button.style.id = params["id"]
    }
    if (!params["position"]) {
        button.style.position = 'fixed'
    } else {
        button.style.position = params["position"]
    }
    button.style.font = 'inherit'
    if (width > 0) {
        button.style.width = width+'px'
    }
    if (height > 0) {
        button.style.height = height+'px'
    }
    if (!params["area"]) {
        document.body.append(button)
    } else {
        document.getElementById(params["area"]).append(button)
    }
}
function events_logger() {
    try {
        const bEngine = this["com.stencyl.Engine"].engine
        for (var i=0; i<events.length; i++) {
            if (events[i].event.toLowerCase() == "changemap") {
                if (typeof old_map == 'undefined') {
                    old_map = bEngine.getGameAttribute("CurrentMap")
                } else if (old_map != null) {
                    new_map = bEngine.getGameAttribute("CurrentMap")
                    if (new_map != old_map) {
                        events[i].func.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__, new_map)
                        old_map = new_map
                    }
                }
            } 
            else if (events[i].event.toLowerCase() == "changeplayer") {
                if (typeof old_user == 'undefined') {
                    old_user = bEngine.getGameAttribute("UserInfo")[0]
                } else if (old_user != null) {
                    new_name = bEngine.getGameAttribute("UserInfo")[0]
                    if (new_name != old_user) {
                        events[i].func.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__, new_name)
                        old_user = new_name
                    }
                }
            }
            else if (events[i].event.toLowerCase() == "sendmessage") {
                if (typeof old_messages == 'undefined') {
                    player_name = bEngine.getGameAttribute("UserInfo")[0]
                    old_message = bEngine.getGameAttribute("DNSM").h["FrendChatyDL1"]
                } else if (old_messages != null) {
                    new_message = bEngine.getGameAttribute("DNSM").h["FrendChatyDL1"]
                    console.log(JSON.stringify(new_message))
                    if (player_name !== bEngine.getGameAttribute("UserInfo")[0]) {
                        player_name = bEngine.getGameAttribute("UserInfo")[0]
                    }
                    if (new_message[1] !== old_message[1] && player_name == new_message[0]) {
                        events[i].func.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__, {name:player_name, message:new_message[1]})
                    }
                    old_message = new_message

                }
            }
        }
    } catch {}
}

function main() {
    const bEngine = this["com.stencyl.Engine"].engine
	function wait(seconds){
		var start = new Date().getTime();
		var end=0;
		while( (end-start) < seconds*1000){
			end = new Date().getTime();
		}
	}
	function popup(text, timeout) {
        var id = JSON.stringify(Math.random()).replace("0.", "")
        var mainDiv = document.createElement("div")
        mainDiv.id = id
        mainDiv.style.width = "300px"
        mainDiv.style.height = "300px"
        mainDiv.style.border = "1px solid black"
        mainDiv.style.position = "fixed"
        mainDiv.style.top = "150px"
        mainDiv.style.left = "320px"
        mainDiv.style.backgroundColor = "black"
        mainDiv.style.textAlign = "center"
        mainDiv.style.whiteSpace = "pre-wrap"
        mainDiv.style.wordWrap = "break-word"
        var items = text.split("\n")
        for (var i=0; i<items.length; i++) {
            var label = document.createElement("h1")
            label.innerHTML = items[i]
            label.style.position = "relative"
            label.style.top = "50px"
            label.style.fontSize = "10px"
            mainDiv.append(label)
        }
        var remove_btn  =  document.createElement("button")
        remove_btn.type = "button"
        remove_btn.style.position = "relative"
        remove_btn.style.top = "50px"
        remove_btn.style.fontSize = "10px"
        remove_btn.innerHTML = "ok"
        remove_btn.onclick = function() {
            document.getElementById(id).remove()
        }
        mainDiv.append(remove_btn)
        document.body.append(mainDiv)
        setTimeout(function() {try {document.getElementById(id).remove()} catch {}}, timeout*1000)
    }
    async function customPrompt(params) {
        var func = params[1]
        var params = params[0]
        var old_output = window.output
        var returns = []
        var mainDiv = document.createElement("div")
        mainDiv.id = "prompt_box"
        mainDiv.style.width = "300px"
        mainDiv.style.height = "300px"
        mainDiv.style.border = "1px solid black"
        mainDiv.style.position = "fixed"
        mainDiv.style.top = "150px"
        mainDiv.style.left = "320px"
        mainDiv.style.backgroundColor = "black"
        mainDiv.style.textAlign = "center"
        for (var i=0; i<params.length; i++) {
            var input = document.createElement("input")
            if (params[i].type === "text") {
                input.type = "text"
            } else if (params[i].type === "check") {
                input.type === "checkbox"
            }
            if (params[i].text !== null) {
                var label = document.createElement("h1")
                label.innerHTML = params[i].text
                label.style.position = "relative"
                label.style.top = "50px"
                label.style.fontSize = "10px"
                mainDiv.append(label)
            }
            input.style.top = "50px"
            input.style.position = "relative"
            input.name = i
            mainDiv.append(input)
        }
        var submit = document.createElement("button")
        submit.style.top = "50px"
        submit.style.position = "relative"
        submit.id = "submit"
        submit.innerHTML = "submit"
        submit.style.fontSize = "10px"
        submit.onclick = function() {
            for (var i=0; i<params.length; i++) {
                console.log(document.getElementsByName(i)[0].value)
                returns.push(document.getElementsByName(i)[0].value) 
            }
            document.getElementById("prompt_box").remove()
            window.output = returns
        }
        mainDiv.append(submit)
        document.body.append(mainDiv)
        function wait_till() {
            if (window.output === old_output) {
                window.setTimeout(wait_till, 100)
            } else {
                func.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__, window.output)
            }
        }
        wait_till()
    }
    function chng(params) {
        var params = params[0].split(" ")
        const CList = this["com.stencyl.Engine"].engine.getGameAttribute("CustomLists").h
        const bEngine = this["com.stencyl.Engine"].engine
        const itemDefs = this["scripts.ItemDefinitions"].itemDefs.h
        const actorEvents189 = this["scripts.ActorEvents_189"]
        const monsterDefs = this["scripts.MonsterDefinitions"].monsterDefs.h
        const ActorEvents124 = this["scripts.ActorEvents_124"]
        try {
            const character = bEngine.getGameAttribute("OtherPlayers").h[bEngine.getGameAttribute("UserInfo")[0]]
            var x = character.getXCenter()
            var y = character.getValue("ActorEvents_20", "_PlayerNode")
        } catch(error) {}
        try{
            if (params.length === 1) {
                var e = eval(params[0])
                popup(`${params[0]} => ${JSON.stringify(e)}`, 30)
            }
            else {
                var together = ''
                for (var i=0; i<params.length; i++) {
                    if (i !== params.length) {
                        together += params[i]+" "
                    } else {
                        together += params[i]
                    }
                }
                var e = eval(together)
                popup(`${together} => ${JSON.stringify(e)}`, 30)
            }
        } catch(error){ popup(`Error: ${err}`, 10)}
    }
    function search(params) {
        var params = params[0].split(" ")
        const queryX 		= params.slice(1) && params.slice(1).length ? params.slice(1).join(' ').toLowerCase() : undefined
        const bEngine 		= this["com.stencyl.Engine"].engine
        const itemDefs 		= this["scripts.ItemDefinitions"].itemDefs.h
        const ItemVals		= [[],[]]
        const searchVals 	= []
        if(queryX){
            if(params[0] === "item"){
                searchVals.push("Id, Item")
                for(const [key, value] of Object.entries(itemDefs)){
                    const valName = value.h.displayName.replace(/_/g, ' ').toLowerCase()
                    if (valName.includes(queryX)) searchVals.push(`${key} - ${valName}`)
                }
            } else if(params[0] === "monster"){
                searchVals.push("Id, Monster")
                const monsterDefs 	= this["scripts.MonsterDefinitions"].monsterDefs.h
                for (const [key, value] of Object.entries(monsterDefs)) {
                    const valName = value.h["Name"].replace(/_/g, ' ').toLowerCase()
                    if (valName.includes(queryX)) searchVals.push(`${key} - ${valName}`)
                }
            } else if(params[0] === "talent"){
                searchVals.push("Order, Id, Talent")
                const talentDefs 	= this["com.stencyl.Engine"].engine.getGameAttribute("CustomLists").h["TalentIconNames"]
                const Order 		= this["com.stencyl.Engine"].engine.getGameAttribute("CustomLists").h["TalentOrder"]
                for(var i=0; i < Order.length; i++){
                    const valName = talentDefs[Order[i]].replace(/_/g, ' ').toLowerCase()
                    if (valName.includes(queryX)) searchVals.push(`${i} - ${Order[i]} - ${valName}`)
                }
            } else if(params[0] === "smith"){
                searchVals.push("Tab, Id, ItemId, ItemName")
                const ItemToCraftNAME = bEngine.getGameAttribute("CustomLists").h["ItemToCraftNAME"]
                for(const [key, value] of Object.entries(itemDefs)){
                    const valName = value.h.displayName.replace(/_/g, ' ').toLowerCase()
                    if (valName.includes(queryX)) ItemVals.push([key,valName])
                }
                for(h=0; h < ItemVals.length; h++) for(i=0; i < ItemToCraftNAME.length; i++) for(j=0; j < ItemToCraftNAME[i].length; j++)
                    if (ItemVals[h][0] == ItemToCraftNAME[i][j]) searchVals.push(`${i+i}, ${j}, ${ItemVals[h][0]}, ${ItemVals[h][1]}`)
            } else return "Invalid sub-command! Valid ones are:\n item\n monster\n talent\n smith"
            if (searchVals.length > 0) return searchVals.join('\n')
            else return `No info found for '${queryX}'`
        }
    }
    function spawn(param) {
        var params = param[0].split(" ")
        const bEngine = this["com.stencyl.Engine"].engine
        const monsterDefs = this["scripts.MonsterDefinitions"].monsterDefs.h
        const ActorEvents124 = this["scripts.ActorEvents_124"]
        const character = bEngine.getGameAttribute("OtherPlayers").h[bEngine.getGameAttribute("UserInfo")[0]]
        const monster = params[0]
        const spawnAmnt 	= params[1] || 1
        try{
            const monsterDefinition = monsterDefs[monster]
            if(monsterDefinition){
                var x = character.getXCenter()
                var y = character.getValue("ActorEvents_20", "_PlayerNode")
                for(var i=0; i<spawnAmnt; i++) ActorEvents124._customBlock_CreateMonster(monster, y, x)
                popup(`Spawned ${monsterDefinition.h["Name"].replace(/_/g, ' ')} ${spawnAmnt} time(s)`, 15)
            } else  popup(`No monster found for '${monster}'`, 15)
        } catch (err) {popup(`Error: ${err}`, 15)}
    }
    function drop(param) {
        console.log(JSON.stringify(param))
        const bEngine = this["com.stencyl.Engine"].engine
        const itemDefs = this["scripts.ItemDefinitions"].itemDefs.h
        const actorEvents189 = this["scripts.ActorEvents_189"]
        const character = bEngine.getGameAttribute("OtherPlayers").h[bEngine.getGameAttribute("UserInfo")[0]]
        var params = param[0].split(" ")
        const item 		= params[0]
        const amount 	= params[1] || 1
        try {
            const itemDefinition = itemDefs[item]
            if (itemDefinition) {
                var x = character.getXCenter()
                var y = character.getValue("ActorEvents_20", "_PlayerNode")
                if(item.includes("SmithingRecipes")) actorEvents189._customBlock_DropSomething(item, 0, amount, 0, 2, y, 0, x, y)
                else actorEvents189._customBlock_DropSomething(item, amount, 0, 0, 2, y, 0, x, y)
                popup(`Dropped ${itemDefinition.h.displayName.replace(/_/g, ' ')}. (x${amount})`, 15)
            } else popup(`No item found for '${item}'`, 15)
        } catch (err) {popup(`Error: ${err}`, 15)}
    }
    function killAll() {
        const bEngine = this["com.stencyl.Engine"].engine
        var Hps = bEngine.getGameAttribute("MonsterHP")
        killed = 0
        for(var i=0; i<Hps.length; i++) {
            if (Hps[i] !== null && Hps[i] !== 0) {
                killed += 1
                Hps[i] = 0
            }
        }
        if (killed !== 0) {
            popup(`killed (x${killed}) mobs`, 15)
        } else {
            popup("No mobs to kill", 15)
        }
    }
	function guildpoints() {
		const bEngine = this["com.stencyl.Engine"].engine
		var guildTask = bEngine.getGameAttribute("GuildTasks")
		for (var i=0; i<guildTask.length; i++) {
			if (i != 0) {
				guildTask[i][2]=100000000
			}
		}
	}
	console.log("Initializing")
	var frames = document.getElementsByTagName("iframe")
	for (i = 0; i < frames.length; ++i)
	{
    	frames[i].style.position = "absolute"
    	frames[i].style.bottom = "0px"
		frames[i].height = "90%"
	}
	var main = document.createElement("div")
	main.id = "cheats-main"
	main.style.textAlign = "center"
	main.style.color = "white"
	main.style.position = "fixed"
	main.style.top = "31px"
	main.style.backgroundColor = "black"
	document.body.append(main)
	console.log("Finished initialization")
	console.log("building Buttons")
	build_button({name:"guildPoints", x:0, y:31, backColor:"black", txtColor:"white", fontSize:10, area:"cheats-main", func:guildpoints})
    build_button({name:"killall", x:-90, y:31, backColor:"black", txtColor:"white", fontSize:10, area:"cheats-main", func:killAll})
    build_button({name:"drop", x:-140, y:31, backColor:"black", txtColor:"white", fontSize:10, area:"cheats-main", func:customPrompt, params:[[{type:"text", text:"drop"}], drop]})
    build_button({name:"spawn", x:-190, y:31, backColor:"black", txtColor:"white", fontSize:10, area:"cheats-main", func:customPrompt, params:[[{type:"text", text:"spawn"}], spawn]})
	build_button({name:"search", x:-250, y:31, backColor:"black", txtColor:"white", fontSize:10, area:"cheats-main", func:customPrompt, params:[[{type:"text", text:"search"}], search]})
    console.log("finished building buttons")
	console.log("Building keybinds")
    document.onkeydown = async function(e) {
		for (var i=0; i<keybinds.length; i++) {
			if (e.key === keybinds[i].key && keybinds[i].key !== '') {
                if (!keybinds[i].params) {
                    keybinds[i].func.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__)
                } else {
                    keybinds[i].func.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__, keybinds[i].params)
                }
			}
		}
	}
    keybinds.push({key:"l", func:killAll})
	console.log("Finished building keybinds")
    console.log("Building events logger")
    events.push({event:"changemap", func:function(e){console.log(e)}})
    events.push({event:"sendmessage", func:function(e){console.log(JSON.stringify(e))}})
    setInterval(function() {events_logger.call(window.document.querySelector('iframe').contentWindow.__idleon_cheats__)}, 10)
	testDone = true
}

