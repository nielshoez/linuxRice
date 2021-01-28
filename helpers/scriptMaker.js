const fs = require('fs')

function createScriptInfo(body) {
    const scriptName = body.script
    const theme = getThemeNameByIndex(body.imgSlct)
    const plugins = getPluginList(body)
    return({scriptName: scriptName, theme: theme, plugins: plugins})
}

function getThemeNameByIndex(index) {
    const scriptNames = ["af-magic", "fino", "gozilla"]
    return (scriptNames[index]);
}

function getPluginList(body) {
    const plugins = [false,false,false]
    if (body.autojump) {
        plugins[0] = true
    } if (body.autocompletion) {
        plugins[1] = true
    } if (body.synthax) {
        plugins[2] = true
    }
    return (plugins)
}

function createScript(body) {
    const infos = createScriptInfo(body)
    let rawdata = fs.readFileSync("./scripts.json")
    let about = JSON.parse(rawdata)
    var content = about.scriptZsh

    if (infos.theme === "af-magic") {
        content += about.scriptChangeThemeAf-magic
    } else if (infos.theme === "fino") {
        content += about.scriptChangeThemeFino
    } else {
        content += about.scriptChangeThemeGozilla
    }
    if (infos.plugins[0]) {
        content += about.scriptAutojump
    }

    try{
        fs.writeFileSync("./scripts/"+infos.scriptName+".sh", content)
    }catch (e){
        console.log("Cannot write file ", e)
    }
    return (infos.scriptName+".sh")
}

exports.createScript = createScript