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

Helios.paste = function(t) {
    Helios.attributes.forEach(a => {
        t.set(a, Helios.clipboard[a]);
    })
}

Helios.help = function(t) {
    sendChat("", Helios.html);
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

on("chat:message", function(msg) {
    const input = msg.content;
    const playerId = msg.playerid;
    const tokens = input.split(' ');
    const stringPart = tokens[1] === undefined ? undefined : tokens[1];
    const booleanPart = tokens[2] === undefined ? undefined : (tokens[2] === "true")
    const intPart = tokens[3] === undefined ? undefined : parseInt(tokens[3], 10);

    if ( (input.indexOf(Helios.command) === 0 || input.indexOf(Helios.shortHand) === 0) && msg.who.indexOf("(GM)") !== -1) {
        sendChat("Helios", "GM attempting to change sight settings. Let them know if it worked.");
        _.chain(msg.selected)
            .map(function(o){
                let t = getObj('graphic',o._id);
                t.playerId = playerId;
                return t;
            })
            .compact()
            .each(function(t) {
                if(typeof Helios[stringPart] === "function")
                {
                    Helios[stringPart](t, booleanPart, intPart);
                }
            });
    }
});
