// 降低靈敏度
function dead_zone () {
    if (x > -100 && x < 100) {
        x = 0
    }
    if (y > -100 && y < 100) {
        y = 0
    }
}
input.onButtonPressed(Button.B, function () {
    radio.sendValue("STOP", 0)
    sflag = -1 * sflag
})
// 設定控制數值
function joy () {
    turn = Math.map(pins.analogReadPin(AnalogPin.P1), 0, 1023, -255, 255)
    x = Math.map(pins.analogReadPin(AnalogPin.P1), 0, 1023, -255, 255)
    y = Math.map(pins.analogReadPin(AnalogPin.P2), 0, 1023, -255, 255)
    dead_zone()
    // 差速組合
    w1 = x + y
    w2 = x - y
}
let turnFlag = false
let w2 = 0
let w1 = 0
let turn = 0
let y = 0
let x = 0
let sflag = 0
led.setBrightness(255)
basic.showIcon(IconNames.Ghost)
radio.setGroup(39)
let myDot = game.createSprite(3, 3)
pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
music.setBuiltInSpeakerEnabled(true)
let Maxspeed = 10
let Display = 4
sflag = -1
music.setVolume(80)
music.stopMelody(MelodyStopOptions.All)
basic.forever(function () {
    if (input.buttonIsPressed(Button.A) || pins.digitalReadPin(DigitalPin.P13) == 0) {
        basic.pause(80)
        if (input.buttonIsPressed(Button.A) || pins.digitalReadPin(DigitalPin.P13) == 0) {
            turnFlag = !(turnFlag)
            if (turnFlag) {
                basic.showLeds(`
                    . . . . .
                    . # . # .
                    # # . # #
                    . # . # .
                    . . . . .
                    `)
                myDot.set(LedSpriteProperty.Brightness, 100)
                basic.showLeds(`
                    . . # . .
                    . # # # .
                    # . # . #
                    . . # . .
                    . . # . .
                    `)
            } else {
                basic.showIcon(IconNames.Triangle)
                myDot.set(LedSpriteProperty.Brightness, 255)
            }
        }
    } else if (pins.digitalReadPin(DigitalPin.P15) == 0) {
        radio.sendValue("STOP", 0)
        basic.showIcon(IconNames.No)
    } else {
        joy()
        myDot.set(LedSpriteProperty.X, Math.map(x, -255, 255, 0, Display))
        myDot.set(LedSpriteProperty.Y, Math.map(y, -255, 255, Display, 0))
        if (turnFlag) {
            radio.sendValue("turn", -1 * turn)
        } else {
            // 對角2
            radio.sendValue("w2", -1 * w2)
            // 對角1
            radio.sendValue("w1", -1 * w1)
        }
    }
})
