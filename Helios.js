/* ***********  Helios.js
*********************************************
*   The purpose of this script is to quickly solve sight issues on a selected token
*****************************************************************************/
//Storage location
state.activeStatus = state.activeStatus || new Array();

var Helios = Helios || {};
Helios.clipboard = {}
//Personal Settings
Helios.command = "!Helios";
Helios.shortHand = "!H";
Helios.stringCommands = ["play","stop"]
Helios.attributes = [
    "has_night_vision",
    "has_bright_light_vision",
    "bright_light_distance",
    "low_light_distance",
    "dynamic_lighting_enabled",
    "has_night_vision",
    "night_vision_distance",
    "emits_bright_light",
    "bright_light_distance",
    "emits_low_light",
    "dim_light_opacity",
    "low_light_distance",
    "light_sensitivity_multiplier",
    "night_vision_effect",
    "has_limit_field_of_vision",
    "limit_field_of_vision_center",
    "limit_field_of_vision_total",
    "has_limit_field_of_night_vision",
    "limit_field_of_night_vision_center",
    "limit_field_of_night_vision_total",
    "has_directional_bright_light",
    "directional_bright_light_center",
    "directional_bright_light_total",
    "has_directional_dim_light",
    "directional_dim_light_center",
    "directional_dim_light_total",
    "lightColor"
]
Helios.html = `
    <div style='border: 1px solid black; background-color: #FFFFFF; padding: 3px 3px;'>
        Usage: <br>
        <b>!Helios help</b>: Display this help message<br>
        <b>!Helios justFixIt </b>: Use this when you want the game to get on and you will fix it later. Turn on dynamic lighting, daylight, vision, darkvision, and torch for selected token with default distances<br>
        <b>!Helios justFixIt false </b>: Use this when you want the game to get on and you will fix it later. Daylight is turned off. Turn on dynamic lighting, vision, darkvision, and torch for selected token with default distances. Turn off daylight.<br>
        <b>!Helios copy </b>: Copy the sight settings of the selected token<br>
        <b>!Helios paste </b>: Paste the sight settings to the selected token<br>
        <b>!Helios blind </b>: Remove all sight from selected token<br>
        <b>!Helios blind false </b>: Give selected token sight and dark vision<br>
        <b>!Helios darkvision </b>: Give selected token darkvision with a range of 60<br>
        <b>!Helios darkvision false </b>: Remove darkvision from selected token<br>
        <b>!Helios darkvision true 60 </b>: Give selected token darkvision with a range of 60<br>
        <b>!Helios vision </b>: Give selected token vision with a range of 10560<br>
        <b>!Helios torch </b>: Make selected token generate light with a range of 20 bright, 20 dim<br>
        <b>!Helios torch false </b>: Make selected token stop generating light<br>
        <b>!Helios torch true 30 </b>: Make selected token generate light with a range of 30 bright, 30 dim<br>
        <b>!Helios day </b>: Turn on daylight for selected token and the map they are on<br>
        <b>!Helios day true </b>: Turn on daylight for page of the selected token<br>
        <b>!Helios day false </b>: Turn off daylight for page of the selected token<br>
        <b>!Helios night true </b>: Turn off daylight for page of the selected token<br>
        <b>!Helios night false </b>: Turn on daylight for page of the selected token<br>
        <b>!Helios night </b>: Turn off daylight for page of the selected token<br>
        <b>!Helios inside true </b>: Turn off daylight for page of the selected token<br>
        <b>!Helios inside false </b>: Turn on daylight for page of the selected token<br>
        <b>!Helios inside </b>: Turn off daylight for page of the selected token<br>
        <b>!Helios dynamicLighting </b>: Turn on dynamic lighting for page of the selected token<br>
        <b>!Helios dynamicLighting false </b>: Turn off dynamic lighting for page of the selected token<br>
        <b>!Helios dynamicLighting true </b>: Turn on dynamic lighting for page of the selected token<br>
        <b>!Helios lewts </b>: Display the GM notes of the character the selected token represents as line separated loot list<br>
        <b>!Helios image </b>: Display the bio images of the character the selected token represents<br>
        <b>!Helios pimage </b>: Display the bio images of the character the selected token represents without its name<br>
        <b>!Helios play SoundName</b>: Play the sound with the name provided<br>
        <b>!Helios stop SoundName</b>: Stop the sound with the name provided<br>
        <b>!Helios stopAll </b>: Stop all sounds<br>
        <b>!Helios race </b>: Set vision for token based on its characters race. May not take into account sub-race, class features, feats, etc.<br>
         
    </div>
    `
Helios.blind = function(t, blind = true) {
    t.set("has_night_vision", !blind);
    t.set("has_bright_light_vision", !blind);
}

Helios.darkvision = function(t, nightvision=true, distance=60) {
    t.set("has_night_vision", nightvision);
    t.set("night_vision_distance", distance);
}

Helios.vision = function(t, vision = true, distance= 10560) {
    t.set("has_bright_light_vision", vision);
    t.set("bright_light_distance", distance);
}

Helios.torch = function(t, torch=true, distance=20) {
    t.set("emits_bright_light", torch);
    t.set("emits_low_light", torch);
    t.set("bright_light_distance", distance);
    t.set("low_light_distance", distance*2);
}

Helios.day = function(t, day = true) {
    turnOnDaylight(t.playerId, day);
}

Helios.inside = function(t, inside=true) {
    turnOnDaylight(t.playerId, !inside);
}

Helios.night = function(t, inside) {
    Helios.inside(t, inside);
}

Helios.dynamicLighting = function(t, dynamicLighting=true) {
    const pid = getPageForPlayer(t.playerId);
    const page = getObj('page',pid);

    page.set("dynamic_lighting_enabled", dynamicLighting);
}

Helios.justFixIt = function(t, day=true) {
    Helios.dynamicLighting(t, true);
    Helios.day(t, day);
    Helios.vision(t, true);
    Helios.darkvision(t, true);
    Helios.torch(t, true);
}

Helios.copy = function(t) {
    Helios.attributes.forEach(a => {
        Helios.clipboard[a] = t.get(a);
    })
}

Helios.lewts = function (t) {
    let graphic = t;
    let character = getObj('character', graphic.get('represents'));

    if (character) {
        let val = graphic.get('gmnotes');

        if (val && val !== 'null' && val.length > 0) {
            try {
                val = atob(val);  // Decode Base64 if needed
            } catch (e) {
                log("GM Notes are not Base64 encoded.");
            }

            // Decode HTML entities
            val = decodeURIComponent(val);

            // Convert breaks into array of separate lines
            let lines = val.replace(/<\/p>/gi, "\n") // Convert paragraph breaks to new lines
                .replace(/<br\s*\/?>/gi, "\n") // Convert <br> to new lines
                .replace(/<\/?[^>]+(>|$)/g, "") // Strip remaining HTML
                .split(/\r?\n/) // Split into array at newlines
                .filter(line => line.trim().length > 0); // Remove empty lines

            let whom = character.get('name');

            // Build template with multiple lines in separate fields
            let chatMessage = `&{template:default}{{name=${whom}}}`;
            lines.forEach((line, index) => {
                chatMessage += `{{${index + 1}=${line}}}`;
            });

            sendChat(whom, chatMessage);
        } else {
            log("GM Notes are empty or null.");
        }
    }
};


Helios.image = function(t) {
    let graphic = t
    let character = getObj('character', graphic.get('represents'))
    let message = ''
    if (character) {
        character.get('bio',  (val) => {
            if (val && val !== 'null' && val.length > 0) {
                const decodeUnicode = (str) => str.replace(/%u[0-9a-fA-F]{2,4}/g, (m) => String.fromCharCode(parseInt(m.slice(2), 16)));

                let decodedVal = decodeUnicode(val);
                let regex = new RegExp(`^g`, 'i');

                let message;

                // Extract images before modifying message
                let artwork = decodedVal.match(/<img[^>]+src="[^"]+"[^>]*>/g);

                if (artwork && artwork.length > 0) {
                    message = artwork.join(' '); // Join if multiple images exist
                } else {
                    message = 'No artwork exists for this character.';
                }

                let whom = character.get('name');
                sendChat(whom, `&{template:default}{{name=${whom}}}{{=${message}}}`);
            }
        });


    }


}
Helios.pimage = function(t) {
    let graphic = t
    let character = getObj('character', graphic.get('represents'))
    let message = ''
    if (character) {
        character.get('bio',  (val) => {
            if (val && val !== 'null' && val.length > 0) {
                const decodeUnicode = (str) => str.replace(/%u[0-9a-fA-F]{2,4}/g, (m) => String.fromCharCode(parseInt(m.slice(2), 16)));

                let decodedVal = decodeUnicode(val);
                let regex = new RegExp(`^g`, 'i');

                let message;

                // Extract images before modifying message
                let artwork = decodedVal.match(/<img[^>]+src="[^"]+"[^>]*>/g);

                if (artwork && artwork.length > 0) {
                    message = artwork.join(' '); // Join if multiple images exist
                } else {
                    message = 'No artwork exists for this character.';
                }

                let whom = character.get('name');
                sendChat("Unknown creature", `&{template:default}{{name="?"}}{{=${message}}}`);
            }
        });


    }


}
Helios.paste = function(t) {
    Helios.attributes.forEach(a => {
        t.set(a, Helios.clipboard[a]);
    })
}

Helios.help = function(t) {
    sendChat("", Helios.html);
}

Helios.play = function(t, sound) {
    log("Playing Sound: "+sound)
    setTrackPlaying(sound, true);
}

Helios.stop = function(t, sound) {
    setTrackPlaying(sound, false);
}
Helios.stopAll = function(t) {
    stopAllSounds();
}
Helios.race = function(t) {
    let race = getRaceFromToken(t);
    let defaultVision = {
        "has_night_vision": false,
        "night_vision_distance": 0,
        "has_bright_light_vision": true,
        "bright_light_distance": 10560,
        "dynamic_lighting_enabled": true,
    }
    let defaultNightVision = {
        "has_night_vision": true,
        "night_vision_distance": 60,
        "has_bright_light_vision": true,
        "bright_light_distance": 10560,
        "dynamic_lighting_enabled": true,
    }
    sendChat("Helios", "Setting Vision For Race: " + race);
    let raceVision = {
        "Aarakocra":    defaultVision,
        "Aasimar":      defaultNightVision,
        "Bugbear":      defaultNightVision,
        "Centaur":      defaultVision,
        "Changeling":   defaultVision,
        "Dragonborn":   defaultVision,
        "Dwarf":        defaultNightVision,
        "Elf":          defaultNightVision,
        "Firbolg":      defaultVision,
        "Fairy":        defaultVision,
        "Genasi":       defaultVision,
        "Gith":         defaultVision,
        "Gnome":        defaultNightVision,
        "Goblin":       defaultNightVision,
        "Goliath":      defaultVision,
        "Grung":        defaultVision,
        "Half-Elf":     defaultNightVision,
        "Halfling":     defaultVision,
        "Half-Orc":     defaultNightVision,
        "Human":        defaultVision,
        "Hobgoblin":    defaultNightVision,
        "Kenku":        defaultVision,
        "Kalashtar":    defaultVision,
        "Kobold":       defaultNightVision,
        "Leonin":       defaultVision,
        "Lineages":     defaultVision,
        "Lizardfolk":   defaultNightVision,
        "Locathah":     defaultVision,
        "Loxodon":      defaultVision,
        "Minotaur":     defaultVision,
        "Orc":          defaultNightVision,
        "Owlfolk":      defaultNightVision,
        "Rabbitfolk":   defaultVision,
        "Satyr":        defaultVision,
        "Shifter":      defaultNightVision,
        "Simic Hybrid": defaultNightVision,
        "Tabaxi":       defaultNightVision,
        "Tiefling":     defaultNightVision,
        "Tortle":       defaultVision,
        "Triton":       defaultVision,
        "Vedalken":     defaultVision,
        "Verdan":       defaultVision,
        "Warforged":    defaultVision,
        "Yuan-Ti Pureblood": defaultNightVision
    }
    let vision = raceVision[race]
    if(vision) {
        Object.keys(vision).forEach(key => {
            t.set(key, vision[key]);
        });
    }

}
function varDump(variable, depth = 2, seen = new WeakSet()) {
    if (variable === null) return "null";
    if (variable === undefined) return "undefined";
    if (typeof variable === "function") return "[Function]";
    if (typeof variable === "symbol") return "[Symbol]";

    if (typeof variable === "object") {
        if (seen.has(variable)) return "[Circular Reference]";
        seen.add(variable);

        let indent = "  ".repeat(2 - depth);
        if (Array.isArray(variable)) {
            return "[\n" + variable.map(v => indent + varDump(v, depth - 1, seen)).join(",\n") + "\n]";
        }

        if (depth > 0) {
            return "{\n" + Object.entries(variable)
                .map(([key, value]) => `${indent}${key}: ${varDump(value, depth - 1, seen)}`)
                .join(",\n") + "\n}";
        }
        return "[Object]";
    }

    return String(variable);
}
const getPageForPlayer = (playerid) => {
    let player = getObj('player',playerid);
    if(playerIsGM(playerid)){
        return player.get('lastpage') || Campaign().get('playerpageid');
    }

    let playerSpecificPages = Campaign().get('playerspecificpages');
    if(playerSpecificPages[playerid]){
        return playerSpecificPages[playerid];
    }

    return Campaign().get('playerpageid');
};

const turnOnDaylight = (playerId, on=true) => {
    const who = (getObj('player', playerId)||{get:()=>'API'}).get('_displayname');
    const pid = getPageForPlayer(playerId);
    const page = getObj('page',pid);
    let field = '';

    if(page.get('dynamic_lighting_enabled')) {
        field = 'daylight_mode_enabled';
    } else if(page.get('showlighting')) {
        field = 'lightglobalillum';
    }
    page.set(field, on);
}
const setTrackPlaying = function(name, action= true) {
    log("Playing Sound: "+name+" Action: "+action)
    var t = findObjs({type: 'jukeboxtrack', title: name})[0];
    if(t) {
        t.set('playing',false);
        t.set('softstop',false);
        t.set('playing', action);
    } else {
        log("Track not found: "+name);
    }
}

const stopAllSounds = function() {
    var tracks = findObjs({type: 'jukeboxtrack', playing: true});
    if(tracks) {
        _.each(tracks, function(sound) {
            sound.set('playing', false);
        });
    }
}
const getRaceFromToken = function(token) {
    let character = token ? getObj("character", token.get("represents")) : null;
    let raceAttr = character ? findObjs({ type: "attribute", characterid: character.id, name: "race" })[0] : null;

    if (!raceAttr) {
        log("Race not found.");
        return null;
    }
    return raceAttr.get("current");
}

on("chat:message", function(msg) {
    const input = msg.content;
    const playerId = msg.playerid;
    const tokens = input.split(' ');
    const stringPart = tokens[1] === undefined ? undefined : tokens[1];
    const booleanPart = tokens[2] === undefined ? undefined : (tokens[2] === "true")
    const intPart = tokens[3] === undefined ? undefined : parseInt(tokens[3], 10);

    if ( (input.indexOf(Helios.command) === 0 || input.indexOf(Helios.shortHand) === 0) && msg.who.indexOf("(GM)") !== -1) {
        //sendChat("Helios", "GM attempting to change sight settings. Let them know if it worked.");
        _.chain(msg.selected)
            .map(function(o){
                let t = getObj('graphic',o._id);
                t.playerId = playerId;
                return t;
            })
            .compact()
            .each(function(t) {
                if(Helios.stringCommands.includes(stringPart)) {
                    Helios[stringPart](t, tokens.slice(2).join(' '));
                }
                else if(typeof Helios[stringPart] === "function")
                {
                    Helios[stringPart](t, booleanPart, intPart);
                }
            });
    }
});
