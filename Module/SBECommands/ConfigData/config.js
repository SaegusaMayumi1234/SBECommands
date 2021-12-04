import { @Vigilant, @TextProperty, @ColorProperty, @ButtonProperty, @SwitchProperty, @DecimalSliderProperty, @SliderProperty, @CheckboxProperty, Color } from 'Vigilance';

@Vigilant("SBECommands")
class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription("enable/disable", "You can enable or disable any commands for this modules, &cbut it only take effect after you restarting your minecraft client!")
    }

    @SwitchProperty({
        name: "calcpet",
        description: "",
        category: "enable/disable",
    })
    calcpet = true;

    @SwitchProperty({
        name: "calcskill",
        description: "",
        category: "enable/disable",
    })
    calcskill = true;

    @SwitchProperty({
        name: "calccata",
        description: "",
        category: "enable/disable",
    })
    calccata = true;

    @SwitchProperty({
        name: "fake",
        description: "",
        category: "enable/disable",
    })
    fake = true;

    @SwitchProperty({
        name: "ginfo",
        description: "",
        category: "enable/disable",
    })
    ginfo = true;

    @SwitchProperty({
        name: "sbprofiles",
        description: "",
        category: "enable/disable",
    })
    sbprofiles = true;

    @SwitchProperty({
        name: "player",
        description: "",
        category: "enable/disable",
    })
    player = true;

    @SwitchProperty({
        name: "weight",
        description: "",
        category: "enable/disable",
    })
    weight = true;

    @SwitchProperty({
        name: "nw",
        description: "",
        category: "enable/disable",
    })
    nw = true;

    @SwitchProperty({
        name: "sbskills",
        description: "",
        category: "enable/disable",
    })
    sbskills = true;

    @SwitchProperty({
        name: "slayer",
        description: "",
        category: "enable/disable",
    })
    slayer = true;

    @SwitchProperty({
        name: "cata",
        description: "",
        category: "enable/disable",
    })
    cata = true;

    @SwitchProperty({
        name: "ms",
        description: "",
        category: "enable/disable",
    })
    ms = true;

    @SwitchProperty({
        name: "wealth",
        description: "",
        category: "enable/disable",
    })
    wealth = true;

    @SwitchProperty({
        name: "sbpets",
        description: "",
        category: "enable/disable",
    })
    sbpets = true;

    @SwitchProperty({
        name: "sbhotm",
        description: "",
        category: "enable/disable",
    })
    sbhotm = true;

    @SwitchProperty({
        name: "targetpractice",
        description: "",
        category: "enable/disable",
    })
    targetpractice = true;

    @SwitchProperty({
        name: "essence",
        description: "",
        category: "enable/disable",
    })
    essence = true;

    @SwitchProperty({
        name: "inventory",
        description: "",
        category: "enable/disable",
    })
    inventory = true;
}

export default new Settings;