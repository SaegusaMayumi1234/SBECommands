import { @Vigilant, @TextProperty, @ColorProperty, @ButtonProperty, @SwitchProperty, @DecimalSliderProperty, @SliderProperty, @CheckboxProperty, Color } from 'Vigilance';

@Vigilant('SBECommands', 'SBECommands Settings', {
    getCategoryComparator: () => (a, b) => {
        const categories = ['Enable/Disable', 'Custom Commands', 'Others'];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription('Enable/Disable', 'You can enable or disable any commands for this module, &cbut it only take effect after you do \'/ct load\' but recommended to restarting your minecraft client!')
        this.setCategoryDescription('Custom Commands', 'You can make custom commands for this modules (leave it blank to reset and use default command), &cIt only take effect after you do \'/ct load\' but recommended to restarting your minecraft client!')
        this.setCategoryDescription('Others', 'Some settings for commands or feature in this module')
    }

    @SwitchProperty({
        name: 'Show stats when party finder join',
        description: 'Show stats when someone join using kuudra and dungeon party finder',
        category: 'Others',
    })
    pfStats = true;

    @SwitchProperty({
        name: 'Do not self check when joining party finder',
        description: 'When showing stats using party finder join, will not check your own stats.',
        category: 'Others',
    })
    hideSelfCheck = false;

    @SwitchProperty({
        name: 'Search items in backpacks and enderchest',
        description: 'When showing stats using the /check or /pcheck command or party finder join, will search items not only in inventory but also in backpacks and enderchest.',
        category: 'Others',
    })
    deepScan = false;

    @SwitchProperty({
        name: 'Hide duplicate items',
        description: 'When showing stats using the /check or /pcheck command or party finder join, will hide items that are duplicate except for Terminator &c(Might not showing the best item)&7.',
        category: 'Others',
    })
    hideDupe = false;

    @SwitchProperty({
        name: 'Show additional dungeon items',
        description: 'When showing stats using the /check or /pcheck command or party finder join, will show if the person has Infinileap, Infinityboom TNT, Rabbit Hat, or Spring Boots.',
        category: 'Others',
    })
    showAdditional = true;

    @SwitchProperty({
        name: 'calcpet',
        description: '',
        category: 'Enable/Disable',
    })
    calcpet = true;

    @SwitchProperty({
        name: 'calcskill',
        description: '',
        category: 'Enable/Disable',
    })
    calcskill = true;

    @SwitchProperty({
        name: 'calccata',
        description: '',
        category: 'Enable/Disable',
    })
    calccata = true;

    @SwitchProperty({
        name: 'fake',
        description: '',
        category: 'Enable/Disable',
    })
    fake = true;

    @SwitchProperty({
        name: 'ginfo',
        description: '',
        category: 'Enable/Disable',
    })
    ginfo = true;

    @SwitchProperty({
        name: 'sbprofiles',
        description: '',
        category: 'Enable/Disable',
    })
    sbprofiles = true;

    @SwitchProperty({
        name: 'player',
        description: '',
        category: 'Enable/Disable',
    })
    player = true;

    @SwitchProperty({
        name: 'weight',
        description: '',
        category: 'Enable/Disable',
    })
    weight = true;

    @SwitchProperty({
        name: 'nw',
        description: '',
        category: 'Enable/Disable',
    })
    nw = true;

    @SwitchProperty({
        name: 'sbskills',
        description: '',
        category: 'Enable/Disable',
    })
    sbskills = true;

    @SwitchProperty({
        name: 'slayer',
        description: '',
        category: 'Enable/Disable',
    })
    slayer = true;

    @SwitchProperty({
        name: 'cata',
        description: '',
        category: 'Enable/Disable',
    })
    cata = true;

    @SwitchProperty({
        name: 'ms',
        description: '',
        category: 'Enable/Disable',
    })
    ms = true;

    @SwitchProperty({
        name: 'wealth',
        description: '',
        category: 'Enable/Disable',
    })
    wealth = true;

    @SwitchProperty({
        name: 'sbpets',
        description: '',
        category: 'Enable/Disable',
    })
    sbpets = true;

    @SwitchProperty({
        name: 'sbhotm',
        description: '',
        category: 'Enable/Disable',
    })
    sbhotm = true;

    @SwitchProperty({
        name: 'targetpractice',
        description: '',
        category: 'Enable/Disable',
    })
    targetpractice = true;

    @SwitchProperty({
        name: 'essence',
        description: '',
        category: 'Enable/Disable',
    })
    essence = true;

    @SwitchProperty({
        name: 'inventory',
        description: '',
        category: 'Enable/Disable',
    })
    inventory = true;

    @SwitchProperty({
        name: 'pcheck',
        description: '',
        category: 'Enable/Disable',
    })
    pcheck = true;

    @SwitchProperty({
        name: 'check',
        description: '',
        category: 'Enable/Disable',
    })
    check = true;

    @SwitchProperty({
        name: 'trophyfish',
        description: '',
        category: 'Enable/Disable',
    })
    trophyfish = true;

    @SwitchProperty({
        name: 'crimson',
        description: '',
        category: 'Enable/Disable',
    })
    crimson = true;

    //Custom
    @TextProperty({
        name: 'calcpet',
        description: '',
        category: 'Custom Commands',
    })
    customcalcpet = '';

    @TextProperty({
        name: 'calcskill',
        description: '',
        category: 'Custom Commands',
    })
    customcalcskill = '';

    @TextProperty({
        name: 'calccata',
        description: '',
        category: 'Custom Commands',
    })
    customcalccata = '';

    @TextProperty({
        name: 'fake',
        description: '',
        category: 'Custom Commands',
    })
    customfake = '';

    @TextProperty({
        name: 'ginfo',
        description: '',
        category: 'Custom Commands',
    })
    customginfo = '';

    @TextProperty({
        name: 'sbprofiles',
        description: '',
        category: 'Custom Commands',
    })
    customsbprofiles = '';

    @TextProperty({
        name: 'player',
        description: '',
        category: 'Custom Commands',
    })
    customplayer = '';

    @TextProperty({
        name: 'weight',
        description: '',
        category: 'Custom Commands',
    })
    customweight = '';

    @TextProperty({
        name: 'nw',
        description: '',
        category: 'Custom Commands',
    })
    customnw = '';

    @TextProperty({
        name: 'sbskills',
        description: '',
        category: 'Custom Commands',
    })
    customsbskills = '';

    @TextProperty({
        name: 'slayer',
        description: '',
        category: 'Custom Commands',
    })
    customslayer = '';

    @TextProperty({
        name: 'cata',
        description: '',
        category: 'Custom Commands',
    })
    customcata = '';

    @TextProperty({
        name: 'ms',
        description: '',
        category: 'Custom Commands',
    })
    customms = '';

    @TextProperty({
        name: 'wealth',
        description: '',
        category: 'Custom Commands',
    })
    customwealth = '';

    @TextProperty({
        name: 'sbpets',
        description: '',
        category: 'Custom Commands',
    })
    customsbpets = '';

    @TextProperty({
        name: 'sbhotm',
        description: '',
        category: 'Custom Commands',
    })
    customsbhotm = '';

    @TextProperty({
        name: 'targetpractice',
        description: '',
        category: 'Custom Commands',
    })
    customtargetpractice = '';

    @TextProperty({
        name: 'essence',
        description: '',
        category: 'Custom Commands',
    })
    customessence = '';

    @TextProperty({
        name: 'inventory',
        description: '',
        category: 'Custom Commands',
    })
    custominventory = '';

    @TextProperty({
        name: 'pcheck',
        description: '',
        category: 'Custom Commands',
    })
    custompcheck = '';

    @TextProperty({
        name: 'check',
        description: '',
        category: 'Custom Commands',
    })
    customcheck = '';

    @TextProperty({
        name: 'trophyfish',
        description: '',
        category: 'Custom Commands',
    })
    customtrophyfish = '';

    @TextProperty({
        name: 'crimson',
        description: '',
        category: 'Custom Commands',
    })
    customcrimson = '';
}

export default new Settings;