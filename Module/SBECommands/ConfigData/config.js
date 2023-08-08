import { @Vigilant, @TextProperty, @ColorProperty, @ButtonProperty, @SwitchProperty, @DecimalSliderProperty, @SliderProperty, @CheckboxProperty, Color } from 'Vigilance';

@Vigilant("SBECommands")
class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription("A. enable/disable", "You can enable or disable any commands for this module, &cbut it only take effect after you do '/ct load' but recommended to restarting your minecraft client!")
        this.setCategoryDescription("B. custom command", "You can make custom commands for this modules (leave it blank to reset and use default command), &cbut it only take effect after you do '/ct load' but recommended to restarting your minecraft client!")
        this.setCategoryDescription("C. other", "Some settings for commands or feature in this module")
    }

    @SwitchProperty({
        name: "Show Stats when party finder join",
        description: "Show stats when someone join using kuudra and dungeon party finder",
        category: "C. other",
    })
    pfStats = true;

    @SwitchProperty({
        name: "Search items in backpacks and enderchest",
        description: "When showing stats using the pcheck command or party finder join, will search items not only in inventory but also in backpacks and enderchest.",
        category: "C. other",
    })
    deepScan = false;

    @SwitchProperty({
        name: "calcpet",
        description: "",
        category: "A. enable/disable",
    })
    calcpet = true;

    @SwitchProperty({
        name: "calcskill",
        description: "",
        category: "A. enable/disable",
    })
    calcskill = true;

    @SwitchProperty({
        name: "calccata",
        description: "",
        category: "A. enable/disable",
    })
    calccata = true;

    @SwitchProperty({
        name: "fake",
        description: "",
        category: "A. enable/disable",
    })
    fake = true;

    @SwitchProperty({
        name: "ginfo",
        description: "",
        category: "A. enable/disable",
    })
    ginfo = true;

    @SwitchProperty({
        name: "sbprofiles",
        description: "",
        category: "A. enable/disable",
    })
    sbprofiles = true;

    @SwitchProperty({
        name: "player",
        description: "",
        category: "A. enable/disable",
    })
    player = true;

    @SwitchProperty({
        name: "weight",
        description: "",
        category: "A. enable/disable",
    })
    weight = true;

    @SwitchProperty({
        name: "nw",
        description: "",
        category: "A. enable/disable",
    })
    nw = true;

    @SwitchProperty({
        name: "sbskills",
        description: "",
        category: "A. enable/disable",
    })
    sbskills = true;

    @SwitchProperty({
        name: "slayer",
        description: "",
        category: "A. enable/disable",
    })
    slayer = true;

    @SwitchProperty({
        name: "cata",
        description: "",
        category: "A. enable/disable",
    })
    cata = true;

    @SwitchProperty({
        name: "ms",
        description: "",
        category: "A. enable/disable",
    })
    ms = true;

    @SwitchProperty({
        name: "wealth",
        description: "",
        category: "A. enable/disable",
    })
    wealth = true;

    @SwitchProperty({
        name: "sbpets",
        description: "",
        category: "A. enable/disable",
    })
    sbpets = true;

    @SwitchProperty({
        name: "sbhotm",
        description: "",
        category: "A. enable/disable",
    })
    sbhotm = true;

    @SwitchProperty({
        name: "targetpractice",
        description: "",
        category: "A. enable/disable",
    })
    targetpractice = true;

    @SwitchProperty({
        name: "essence",
        description: "",
        category: "A. enable/disable",
    })
    essence = true;

    @SwitchProperty({
        name: "inventory",
        description: "",
        category: "A. enable/disable",
    })
    inventory = true;

    @SwitchProperty({
        name: "pcheck",
        description: "",
        category: "A. enable/disable",
    })
    pcheck = true;

    @SwitchProperty({
        name: "trophyfish",
        description: "",
        category: "A. enable/disable",
    })
    trophyfish = true;

    @SwitchProperty({
        name: "crimson",
        description: "",
        category: "A. enable/disable",
    })
    crimson = true;

    //Custom
    @TextProperty({
        name: "calcpet",
        description: "",
        category: "B. custom command",
    })
    customcalcpet = '';

    @TextProperty({
        name: "calcskill",
        description: "",
        category: "B. custom command",
    })
    customcalcskill = '';

    @TextProperty({
        name: "calccata",
        description: "",
        category: "B. custom command",
    })
    customcalccata = '';

    @TextProperty({
        name: "fake",
        description: "",
        category: "B. custom command",
    })
    customfake = '';

    @TextProperty({
        name: "ginfo",
        description: "",
        category: "B. custom command",
    })
    customginfo = '';

    @TextProperty({
        name: "sbprofiles",
        description: "",
        category: "B. custom command",
    })
    customsbprofiles = '';

    @TextProperty({
        name: "player",
        description: "",
        category: "B. custom command",
    })
    customplayer = '';

    @TextProperty({
        name: "weight",
        description: "",
        category: "B. custom command",
    })
    customweight = '';

    @TextProperty({
        name: "nw",
        description: "",
        category: "B. custom command",
    })
    customnw = '';

    @TextProperty({
        name: "sbskills",
        description: "",
        category: "B. custom command",
    })
    customsbskills = '';

    @TextProperty({
        name: "slayer",
        description: "",
        category: "B. custom command",
    })
    customslayer = '';

    @TextProperty({
        name: "cata",
        description: "",
        category: "B. custom command",
    })
    customcata = '';

    @TextProperty({
        name: "ms",
        description: "",
        category: "B. custom command",
    })
    customms = '';

    @TextProperty({
        name: "wealth",
        description: "",
        category: "B. custom command",
    })
    customwealth = '';

    @TextProperty({
        name: "sbpets",
        description: "",
        category: "B. custom command",
    })
    customsbpets = '';

    @TextProperty({
        name: "sbhotm",
        description: "",
        category: "B. custom command",
    })
    customsbhotm = '';

    @TextProperty({
        name: "targetpractice",
        description: "",
        category: "B. custom command",
    })
    customtargetpractice = '';

    @TextProperty({
        name: "essence",
        description: "",
        category: "B. custom command",
    })
    customessence = '';

    @TextProperty({
        name: "inventory",
        description: "",
        category: "B. custom command",
    })
    custominventory = '';

    @TextProperty({
        name: "pcheck",
        description: "",
        category: "B. custom command",
    })
    custompcheck = '';

    @TextProperty({
        name: "trophyfish",
        description: "",
        category: "B. custom command",
    })
    customtrophyfish = '';

    @TextProperty({
        name: "crimson",
        description: "",
        category: "B. custom command",
    })
    customcrimson = '';
}

export default new Settings;