# p-ac-panel

panel

## Properties

| Property        | Attribute | Modifiers | Type       | Default |
|-----------------|-----------|-----------|------------|---------|
| `activeTab`     |           | readonly  | `PACTab[]` |         |
| `childTabPanel` |           | readonly  | `PACTab[]` |         |
| `multi`         | `multi`   |           | `boolean`  | false   |

## Methods

| Method           | Type                                    |
|------------------|-----------------------------------------|
| `findTab`        | `(key: string): PACTab`                 |
| `findTabByIndex` | `(index: number): PACTab`               |
| `getTabIndex`    | `(tab: PACTab): number`                 |
| `setTabToActive` | `(tab: PACTab, active?: boolean): void` |

## Events

| Event        | Description                    |
|--------------|--------------------------------|
| `before-tab` | change 改变child panel 之前        |
| `tab`        | change 改变 child panel state 之后 |


# p-ac-tab

## Properties

| Property         | Attribute | Modifiers | Type              | Default     |
|------------------|-----------|-----------|-------------------|-------------|
| `accordionPanel` |           | readonly  | `PAccordionPanel` |             |
| `active`         | `active`  |           | `boolean`         | false       |
| `header`         | `header`  |           | `string`          | "undefined" |
| `key`            | `key`     |           | `string`          | "undefined" |

## Methods

| Method         | Type                 |
|----------------|----------------------|
| `renderHeader` | `(): TemplateResult` |

## Events

| Event               | Type                          |
|---------------------|-------------------------------|
| `before-tab-change` | `CustomEvent<{ tab: this; }>` |
| `tab-change`        | `CustomEvent<{ tab: this; }>` |


# p-button

## Properties

| Property   | Attribute  | Modifiers | Type              | Default  |
|------------|------------|-----------|-------------------|----------|
| `block`    | `block`    |           | `boolean`         |          |
| `btn`      |            | readonly  | `Element \| null` |          |
| `checked`  | `checked`  |           | `boolean`         |          |
| `disabled` | `disabled` |           | `boolean`         |          |
| `download` | `download` |           | `string`          |          |
| `href`     | `href`     |           | `string`          |          |
| `icon`     | `icon`     |           | `string`          |          |
| `iconEl`   |            | readonly  | `Element \| null` |          |
| `loading`  | `loading`  |           | `boolean`         | false    |
| `name`     | `name`     |           | `string`          |          |
| `rel`      | `rel`      |           | `string`          |          |
| `shape`    | `shape`    |           | `shapeType`       |          |
| `target`   | `target`   |           | `targetType`      | "_blank" |
| `toggle`   | `toggle`   |           | `boolean`         |          |
| `type`     | `type`     |           | `buttonTypeValue` |          |
| `value`    | `value`    |           | `string`          |          |


# p-button-group

## Properties

| Property   | Attribute | Modifiers | Type                  |
|------------|-----------|-----------|-----------------------|
| `elements` |           | readonly  | `NodeListOf<PButton>` |
| `name`     | `name`    |           | `string`              |
| `value`    | `value`   |           | `string`              |

## Events

| Event    | Type                              |
|----------|-----------------------------------|
| `change` | `CustomEvent<{ value: string; }>` |


# p-checkbox

## Properties

| Property     | Attribute    | Modifiers | Type               | Default |
|--------------|--------------|-----------|--------------------|---------|
| `checkbox`   |              | readonly  | `HTMLInputElement` |         |
| `checked`    | `checked`    |           | `boolean`          | false   |
| `disabled`   | `disabled`   |           | `boolean`          | false   |
| `errortips`  | `errortips`  |           | `string`           |         |
| `form`       |              | readonly  | `HTMLFormElement`  |         |
| `invalid`    | `invalid`    |           | `boolean`          | false   |
| `name`       | `name`       |           | `string`           |         |
| `novalidate` | `novalidate` |           | `boolean`          | false   |
| `readonly`   | `readonly`   |           | `boolean`          | false   |
| `required`   | `required`   |           | `boolean`          | false   |
| `tip`        |              | readonly  | `PTips`            |         |
| `validity`   |              | readonly  | `boolean`          |         |
| `value`      | `value`      |           | `string`           |         |

## Methods

| Method          | Type          |
|-----------------|---------------|
| `checkValidity` | `(): boolean` |
| `focus`         | `(): void`    |
| `reset`         | `(): void`    |

## Events

| Event    | Type                                             |
|----------|--------------------------------------------------|
| `blur`   | `CustomEvent<{ value: string; checked: boolean; }>` |
| `change` | `CustomEvent<{ value: string; checed: boolean; }>` |
| `focus`  | `CustomEvent<{ value: string; checked: boolean; }>` |


# p-checkbox-group

## Properties

| Property     | Attribute    | Modifiers | Type                    | Default    |
|--------------|--------------|-----------|-------------------------|------------|
| `disabled`   | `disabled`   |           | `boolean`               | false      |
| `elements`   |              | readonly  | `NodeListOf<PCheckbox>` |            |
| `form`       |              | readonly  | `HTMLFormElement`       |            |
| `invalid`    | `invalid`    |           | `boolean`               | false      |
| `len`        |              | readonly  | `number`                |            |
| `max`        | `max`        |           | `number`                | "Infinity" |
| `min`        | `min`        |           | `number`                | 0          |
| `name`       | `name`       |           | `string`                |            |
| `novalidate` | `novalidate` |           | `boolean`               | false      |
| `readonly`   | `readonly`   |           | `boolean`               | false      |
| `required`   | `required`   |           | `boolean`               | false      |
| `tip`        |              | readonly  | `PTips`                 |            |
| `validity`   |              | readonly  | `boolean`               |            |
| `value`      | `value`      |           | `String[]`              |            |
| `vertical`   | `vertical`   |           | `boolean`               | false      |

## Methods

| Method          | Type          |
|-----------------|---------------|
| `checkAll`      | `(): void`    |
| `checkValidity` | `(): boolean` |
| `reset`         | `(): void`    |

## Events

| Event    | Type                                |
|----------|-------------------------------------|
| `change` | `CustomEvent<{ value: String[]; }>` |


# p-color-panel

## Properties

| Property        | Attribute       | Modifiers | Type                                             | Default   |
|-----------------|-----------------|-----------|--------------------------------------------------|-----------|
| `canChangeType` | `canChangeType` |           | `boolean`                                        | true      |
| `color`         |                 | readonly  | `{ h: number; s: number; v: number; a: number; toHSVA(): number[]; toHSLA(): number[]; toRGBA(): number[]; toCMYK(): number[]; toHEXA(): string[]; clone: () => ...; }` |           |
| `copyValue`     |                 | readonly  | `string`                                         |           |
| `hlsaInputs`    |                 | readonly  | `HTMLInputElement[]`                             |           |
| `palette`       |                 |           | `HTMLElement`                                    |           |
| `rgbColor`      |                 | readonly  | `string`                                         |           |
| `rgbaInputs`    |                 | readonly  | `HTMLInputElement[]`                             |           |
| `typeindex`     | `typeindex`     |           | `number`                                         | 0         |
| `value`         | `value`         |           | `string`                                         | "#ff0000" |

## Methods

| Method                | Type       |
|-----------------------|------------|
| `dispatchChangeEvent` | `(): void` |

## Events

| Event    | Type                                             |
|----------|--------------------------------------------------|
| `change` | `CustomEvent<{ value: string; color: { h: number; s: number; v: number; a: number; toHSVA(): number[]; toHSLA(): number[]; toRGBA(): number[]; toCMYK(): number[]; toHEXA(): string[]; clone: () => ...; }; }>` |


# p-color

## Properties

| Property   | Attribute  | Type      | Default      |
|------------|------------|-----------|--------------|
| `block`    | `block`    | `boolean` | false        |
| `dir`      | `dir`      | `string`  | "bottomleft" |
| `disabled` | `disabled` | `boolean` | false        |
| `value`    | `value`    | `string`  | "#ff0000"    |

## Methods

| Method                | Type       |
|-----------------------|------------|
| `dispatchChangeEvent` | `(): void` |

## Events

| Event    | Type                              |
|----------|-----------------------------------|
| `change` | `CustomEvent<{ value: string; }>` |


# p-date-panel

## Properties

| Property           | Attribute | Modifiers | Type                        | Default |
|--------------------|-----------|-----------|-----------------------------|---------|
| `dateValue`        |           | readonly  | `Date \| null \| undefined` |         |
| `defaultDateValue` |           | readonly  | `Date`                      |         |
| `max`              | `max`     |           | `string`                    |         |
| `maxDate`          |           | readonly  | `Date \| null \| undefined` |         |
| `min`              | `min`     |           | `string`                    |         |
| `minDate`          |           | readonly  | `Date \| null \| undefined` |         |
| `mode`             | `mode`    |           | `selectMode`                | "date"  |
| `range`            | `range`   |           | `boolean`                   |         |
| `renderHeaderStr`  |           | readonly  | `string`                    |         |
| `type`             | `type`    |           | `string`                    |         |
| `value`            | `value`   |           | `string`                    | ""      |

## Methods

| Method                | Type           |
|-----------------------|----------------|
| `dispatchChangeEvent` | `(): void`     |
| `getMonths`           | `(): string[]` |

## Events

| Event    | Type                                             |
|----------|--------------------------------------------------|
| `change` | `CustomEvent<{ value: string; date: Date \| null \| undefined; }>` |


# p-dialog

## Properties

| Property        | Attribute       | Type         | Default     |
|-----------------|-----------------|--------------|-------------|
| `autoclose`     | `autoclose`     | `boolean`    | true        |
| `cancelText`    | `cancelText`    | `string`     | "undefined" |
| `loading`       | `loading`       | `boolean`    | false       |
| `okText`        | `okText`        | `string`     | "undefined" |
| `open`          | `open`          | `boolean`    | false       |
| `removeAble`    | `removeAble`    | `boolean`    | false       |
| `showCancelBtn` | `showCancelBtn` | `boolean`    | false       |
| `title`         | `p-title`       | `string`     | "undefined" |
| `type`          | `type`          | `DialogType` |             |

## Methods

| Method             | Type                                             |
|--------------------|--------------------------------------------------|
| `cancelBtnHandler` | `(): void`                                       |
| `closeBtnHandler`  | `(): void`                                       |
| `submitBtnHandler` | `(): void`                                       |
| `typeMap`          | `(type: string): { name: string; color: string; }` |

## Events

| Event    |
|----------|
| `cancel` |
| `close`  |
| `submit` |


# p-fieldset

panel 容器

## Properties

| Property     | Attribute    | Type      | Default |
|--------------|--------------|-----------|---------|
| `collapsed`  | `collapsed`  | `boolean` |         |
| `header`     | `header`     | `string`  |         |
| `toogleable` | `toogleable` | `boolean` | true    |

## Events

| Event                      | Type                                  | Description                |
|----------------------------|---------------------------------------|----------------------------|
| `before-fieldset`          |                                       | collpase 如果能关闭，点击header 触发 |
| `before-fieldset-collpase` | `CustomEvent<{ collapse: boolean; }>` |                            |
| `fieldset`                 |                                       | collpase 内容关闭、开启后触发        |
| `fieldset-collpase`        | `CustomEvent<{ collapse: boolean; }>` |                            |

## Slots

| Name | Description       |
|------|-------------------|
|      | header header 分发区 |


# p-icon

## Properties

| Property   | Attribute  | Type      | Default               |
|------------|------------|-----------|-----------------------|
| `color`    | `color`    | `string`  | "undefined"           |
| `iconPath` | `iconPath` | `string`  | "./iconfont/icon.svg" |
| `name`     | `name`     | `string`  | "undefined"           |
| `path`     | `path`     | `string`  | "undefined"           |
| `size`     | `size`     | `number`  | -1                    |
| `spin`     | `spin`     | `boolean` | false                 |
| `view`     | `view`     | `number`  | 1024                  |


# p-img

## Properties

| Property     | Attribute    | Modifiers | Type               | Default     | Description                                  |
|--------------|--------------|-----------|--------------------|-------------|----------------------------------------------|
| `alt`        | `alt`        |           | `string`           | "undefined" | 描述                                           |
| `defaultsrc` | `defaultsrc` |           | `string`           |             | 如果图片加载失败，则加载默认图片                             |
| `error`      |              |           | `boolean`          |             |                                              |
| `errorAlt`   | `error-alt`  |           | `string`           | "error"     |                                              |
| `fit`        | `fit`        |           | `string`           | "cover"     | 自适应  同原生object-fit，可取值cover（默认）、fill、contain |
| `gallery`    | `gallery`    |           | `string`           |             | 画廊 组名称                                       |
| `img`        |              | readonly  | `HTMLImageElement` |             |                                              |
| `lazy`       | `lazy`       |           | `boolean`          |             | 是否懒加载（滚动可见此时才加载）                             |
| `ratio`      | `ratio`      |           | `string`           |             | 图片比例 例如'16/9'                                |
| `showAlt`    | `show-alt`   |           | `boolean`          |             | 是否一直显示描述                                     |
| `src`        | `src`        |           | `string`           |             |                                              |

## Methods

| Method  | Type                                     |
|---------|------------------------------------------|
| `focus` | `(): void`                               |
| `load`  | `(src: string, hasload?: boolean): void` |


# p-input

## Properties

| Property               | Attribute      | Modifiers | Type                                 | Default     |
|------------------------|----------------|-----------|--------------------------------------|-------------|
| `block`                | `block`        |           | `boolean \| undefined`               | false       |
| `clear`                | `clear`        |           | `boolean \| undefined`               | false       |
| `customValidateMethod` |                |           | `CustomValidateMethode \| undefined` | "undefined" |
| `debounce`             | `debounce`     |           | `number \| undefined`                | "undefined" |
| `disabled`             | `disabled`     |           | `boolean \| undefined`               | false       |
| `errorMessage`         | `errorMessage` |           | `string \| undefined`                | "undefined" |
| `errortips`            | `errortips`    |           | `string \| undefined`                |             |
| `form`                 |                | readonly  | `HTMLFormElement`                    |             |
| `input`                |                | readonly  | `HTMLInputElement`                   |             |
| `invalid`              | `invalid`      |           | `boolean \| undefined`               | false       |
| `label`                | `label`        |           | `string \| undefined`                |             |
| `leftIcon`             | `leftIcon`     |           | `string \| undefined`                |             |
| `max`                  | `max`          |           | `number \| undefined`                | "undefined" |
| `maxLength`            | `maxLength`    |           | `number \| undefined`                | "undefined" |
| `min`                  | `min`          |           | `number \| undefined`                | "undefined" |
| `minLength`            | `minLength`    |           | `number \| undefined`                | "undefined" |
| `name`                 | `name`         |           | `string \| undefined`                |             |
| `novalidate`           | `novalidate`   |           | `boolean \| undefined`               | false       |
| `pTipCon`              |                | readonly  | `PTips`                              |             |
| `pattern`              | `pattern`      |           | `string \| undefined`                | "undefined" |
| `placeholder`          | `placeholder`  |           | `string`                             |             |
| `readOnly`             | `readOnly`     |           | `boolean \| undefined`               | false       |
| `required`             | `required`     |           | `boolean \| undefined`               | false       |
| `rightIcon`            | `rightIcon`    |           | `string \| undefined`                |             |
| `showStep`             | `showStep`     |           | `boolean \| undefined`               | false       |
| `step`                 | `step`         |           | `number \| undefined`                | 1           |
| `throttle`             | `throttle`     |           | `number \| undefined`                | "undefined" |
| `tips`                 | `tips`         |           | `string`                             |             |
| `type`                 | `type`         |           | `inputtype`                          | "text"      |
| `validationMessage`    |                | readonly  | `string`                             |             |
| `validity`             |                | readonly  | `boolean`                            |             |
| `validityResult`       |                | readonly  | `valiidityResultType`                |             |
| `value`                | `value`        |           | `string \| undefined`                | ""          |

## Methods

| Method           | Type          |
|------------------|---------------|
| `checkValidity`  | `(): boolean` |
| `clearValue`     | `(): void`    |
| `dispatchChange` | `(): void`    |
| `dispatchFocus`  | `(): void`    |
| `focus`          | `(): void`    |
| `reset`          | `(): void`    |
| `searchValue`    | `(): void`    |

## Events

| Event    | Type                                           |
|----------|------------------------------------------------|
| `change` | `CustomEvent<{ value: string; }>`              |
| `focus`  | `CustomEvent<{ value: string; }>`              |
| `input`  | `CustomEvent<{ value: string; }>`              |
| `submit` | `CustomEvent<{ value: string \| undefined; }>` |


# p-iterator

## Properties

| Property   | Type                                       |
|------------|--------------------------------------------|
| `template` | `(item: any, key?: any) => TemplateResult` |
| `value`    | `Object \| Map<T, any> \| Set<T> \| T[]`   |

## Methods

| Method             | Type       |
|--------------------|------------|
| `createRenderRoot` | `(): this` |


# p-row

## Properties

| Property | Attribute | Type     | Default |
|----------|-----------|----------|---------|
| `column` | `column`  | `number` | 24      |
| `grap`   | `grap`    | `number` | 0       |


# p-col

## Properties

| Property | Attribute | Type     | Default |
|----------|-----------|----------|---------|
| `span`   | `span`    | `number` | 1       |


# p-layout

## Properties

| Property     | Attribute    | Type           |
|--------------|--------------|----------------|
| `center`     | `center`     | `boolean`      |
| `crossAgile` | `crossAgile` | `layAgileType` |
| `expand`     | `expand`     | `boolean`      |
| `mainAgile`  | `mainAgile`  | `layAgileType` |
| `row`        | `row`        | `boolean`      |


# p-lazy

## Properties

| Property | Type      | Default |
|----------|-----------|---------|
| `loaded` | `boolean` | false   |


# p-loading

## Properties

| Property    | Attribute | Modifiers | Type                  |
|-------------|-----------|-----------|-----------------------|
| `color`     | `color`   |           | `string`              |
| `loadingEl` |           | readonly  | `HTMLElement \| null` |
| `size`      | `size`    |           | `string`              |


# p-message

## Properties

| Property  | Attribute          | Type      | Default                                          |
|-----------|--------------------|-----------|--------------------------------------------------|
| `block`   | `block`            | `boolean` |                                                  |
| `color`   | `color`            | `string`  |                                                  |
| `hAgile`  | `horizontal-agile` | `string`  |                                                  |
| `icon`    | `icon`             | `string`  |                                                  |
| `loading` | `loading`          | `boolean` | "(text?: string \| MessageType, duration: number = -1, onclose?: Function) => {\n        const defaultInfoConfig: MessageType = { position: PMessage.DEFAULTPOSTION, duration: -1, loading: true };\n        return PMessage._mergerConfig(defaultInfoConfig, text, duration, onclose);\n    }" |
| `show`    | `show`             | `boolean` | "(config: MessageType) => {\n        if (config.position === undefined) {\n            config.position = PMessage.DEFAULTPOSTION;\n        }\n        const div = PMessage._getMessagePositionDIV(config.position);\n        const message: PMessage = new PMessage();\n        if (config.icon) {\n            message.icon = config.icon;\n        }\n        if (config.color) {\n            message.color = config.color;\n        }\n        if (config.loading !== undefined) {\n            message.loading = config.loading;\n        }\n        if (config.position.indexOf('left') >= 0) {\n            message.hAgile = 'left';\n        } else if (config.position.indexOf('right') >= 0) {\n            message.hAgile = 'right';\n        } else {\n            message.hAgile = 'center';\n        }\n        div.appendChild(message);\n        message.textContent = config.text;\n        message.show = true;\n        let timer: number = undefined;\n        if (config.duration && config.duration > 0) {\n            timer = window.setTimeout(() => {\n                message.show = false;\n                config.onclose && config.onclose(message)  ;\n                message.parentElement.removeChild(message);\n            }, config.duration);\n        }\n        return message;\n    }" |


# p-panel

panel 容器

## Properties

| Property     | Attribute    | Type      | Default |
|--------------|--------------|-----------|---------|
| `collapsed`  | `collapsed`  | `boolean` |         |
| `header`     | `header`     | `string`  |         |
| `toogleable` | `toogleable` | `boolean` | true    |

## Events

| Event                   | Type                                  | Description                |
|-------------------------|---------------------------------------|----------------------------|
| `before-panel`          |                                       | collpase 如果能关闭，点击header 触发 |
| `before-panel-collpase` | `CustomEvent<{ collapse: boolean; }>` |                            |
| `panel`                 |                                       | collpase 内容关闭、开启后触发        |
| `panel-collpase`        | `CustomEvent<{ collapse: boolean; }>` |                            |

## Slots

| Name | Description  |
|------|--------------|
|      | header 头部分发区 |


# p-pop

## Properties

| Property     | Attribute    | Modifiers | Type          | Default     |
|--------------|--------------|-----------|---------------|-------------|
| `accomplish` | `accomplish` |           | `boolean`     | false       |
| `cancelText` | `cancelText` |           | `string`      | "undefined" |
| `disabled`   | `disabled`   |           | `boolean`     | false       |
| `okText`     | `okText`     |           | `string`      | "undefined" |
| `popContent` |              | readonly  | `PPopContent` |             |
| `tipContent` | `tipContent` |           | `string`      | "undefined" |
| `tipTitle`   | `tipTitle`   |           | `string`      | "undefined" |
| `trigger`    | `trigger`    |           | `string`      | "click"     |
| `type`       | `type`       |           | `string`      | "undefined" |


# p-pop-content

## Properties

| Property       | Attribute        | Type      | Default     |
|----------------|------------------|-----------|-------------|
| `cancelText`   | `cancelText`     | `string`  | "undefined" |
| `hiddenClose`  | `hiddenClose`    | `boolean` | false       |
| `loading`      | `loading`        | `boolean` | false       |
| `okText`       | `okText`         | `string`  | "undefined" |
| `open`         | `open`           | `boolean` | false       |
| `thinBar`      | `thinBar`        | `boolean` | false       |
| `tipTitle`     | `tip-title`      | `string`  | "undefined" |
| `tipTitleIcon` | `tip-title-icon` | `string`  | "undefined" |
| `type`         | `type`           | `string`  | "undefined" |

## Events

| Event    |
|----------|
| `cancel` |
| `close`  |
| `open`   |
| `submit` |


# p-radio

## Properties

| Property   | Attribute  | Modifiers | Type               | Default |
|------------|------------|-----------|--------------------|---------|
| `checked`  | `checked`  |           | `boolean`          | false   |
| `disabled` | `disabled` |           | `boolean`          | false   |
| `form`     |            | readonly  | `HTMLFormElement`  |         |
| `group`    |            | readonly  | `Element \| null`  |         |
| `name`     | `name`     |           | `string`           |         |
| `radio`    |            | readonly  | `HTMLInputElement` |         |
| `value`    | `value`    |           | `string`           |         |

## Methods

| Method    | Type       |
|-----------|------------|
| `focus`   | `(): void` |
| `tocheck` | `(): void` |

## Events

| Event        | Type                                 | Description  |
|--------------|--------------------------------------|--------------|
| `change`     | `CustomEvent<{ checked: boolean; }>` |              |
| `tab-change` |                                      | end 页签改变完成事件 |


# p-radio-group

## Properties

| Property     | Attribute    | Modifiers | Type                 | Default |
|--------------|--------------|-----------|----------------------|---------|
| `disabled`   | `disabled`   |           | `boolean`            | false   |
| `elements`   |              | readonly  | `NodeListOf<PRadio>` |         |
| `form`       |              | readonly  | `HTMLFormElement`    |         |
| `invalid`    | `invalid`    |           | `boolean`            | false   |
| `name`       | `name`       |           | `string`             |         |
| `novalidate` | `novalidate` |           | `boolean`            | false   |
| `required`   | `required`   |           | `boolean`            | false   |
| `tip`        |              | readonly  | `PTips`              |         |
| `validity`   |              | readonly  | `boolean`            |         |
| `value`      | `value`      |           | `string`             |         |

## Methods

| Method           | Type          |
|------------------|---------------|
| `checkValidity`  | `(): boolean` |
| `setSelectValue` | `(): void`    |

## Events

| Event    | Type                              |
|----------|-----------------------------------|
| `change` | `CustomEvent<{ value: string; }>` |


# p-rate

## Properties

| Property     | Attribute    | Type       | Default     |
|--------------|--------------|------------|-------------|
| `disabled`   | `disabled`   | `boolean`  | false       |
| `hoverable`  | `hoverable`  | `boolean`  | false       |
| `icon`       | `icon`       | `string`   | "star-fill" |
| `name`       | `name`       | `string`   | "undefined" |
| `number`     | `number`     | `number`   | 5           |
| `offColor`   | `offColor`   | `string`   | "undefined" |
| `onColor`    | `onColor`    | `string`   | "undefined" |
| `size`       | `size`       | `number`   | "undefined" |
| `tipStrings` | `tipStrings` | `string[]` | "undefined" |
| `value`      | `value`      | `number`   | 0           |

## Events

| Event    | Type                                           |
|----------|------------------------------------------------|
| `change` | `CustomEvent<{ old: number; value: number; }>` |


# p-scroll

滚动容器

## Properties

| Property             | Attribute              | Modifiers | Type             | Default | Description                    |
|----------------------|------------------------|-----------|------------------|---------|--------------------------------|
| `caculateXBarWidth`  |                        | readonly  | `number`         |         |                                |
| `caculateYBarHeight` |                        | readonly  | `number`         |         |                                |
| `containerDIV`       |                        |           | `HTMLDivElement` |         |                                |
| `contentDIV`         |                        |           | `HTMLDivElement` |         |                                |
| `content_wrap_DIV`   |                        |           | `HTMLDivElement` |         |                                |
| `keyEnable`          | `keyEnable`            |           | `boolean`        | true    | 是否允许 键盘 上下左右按键滚动               |
| `overflowX`          | `overflow-x`           |           | `string`         | ""      | hidden,则水平滚动条永远隐藏，否则根据内容自动显示隐藏 |
| `overflowY`          | `overflow-y`           |           | `string`         | ""      | hidden,则竖直滚动条隐藏，，否则根据内容自动显示隐藏  |
| `partXHandler`       |                        |           | `HTMLDivElement` |         |                                |
| `partXScroll`        |                        |           | `HTMLDivElement` |         |                                |
| `partYHandler`       |                        |           | `HTMLDivElement` |         |                                |
| `partYScroll`        |                        |           | `HTMLDivElement` |         |                                |
| `rightBottom`        |                        |           | `HTMLElement`    |         |                                |
| `scrollBarOutWidth`  | `scroll-bar-out-width` |           | `number`         | 12      | 滚动条 容器宽度，必须大与 滚动条宽度            |
| `scrollBarWidth`     | `scroll-bar-width`     |           | `number`         | 8       | 滚动条宽度                          |
| `throttTime`         | `throttTime`           |           | `number`         | 20      | 事件节流时间                         |
| `wheelScrollChange`  |                        |           | `number`         | 120     |                                |

## Methods

| Method                 | Type                           | Description                                      |
|------------------------|--------------------------------|--------------------------------------------------|
| `caculateXBarPosition` | `(): number`                   |                                                  |
| `caculateYBarPosition` | `(): number`                   |                                                  |
| `changeXBarPosition`   | `(changeValue?: number): void` | 改变水平滚动条的位置<br /><br />**changeValue**: 改变的大小     |
| `changeXScroll`        | `(scrollValue?: number): void` | 改变水平内容滚动位置<br /><br />**scrollValue**: 改变多少      |
| `changeYBarPosition`   | `(changeValue?: number): void` | 改变竖直滚动调大位置<br /><br />**changeValue**: 竖直滚动条的改变值，>0 向下 |
| `changeYScroll`        | `(scrollValue?: number): void` | **scrollValue**: 改变竖直内容滚动位置                      |
| `resize`               | `(): void`                     | 当容器，或者子元素发生变化，触发resize 函数和事件                     |
| `scrollXToEnd`         | `(): void`                     | 水平滚动条滚动到 最右侧                                     |
| `scrollXToValue`       | `(scrollLeft?: number): void`  | **scrollLeft**: 水平内容滚动到特定位置                      |
| `scrollYToEnd`         | `(): void`                     | 竖直滚动条 滚动到底部                                      |
| `scrollYToValue`       | `(scrollTop?: number): void`   | 竖直内容滚动到特定位置                                      |

## Events

| Event           | Type                                             | Description                                      |
|-----------------|--------------------------------------------------|--------------------------------------------------|
| `resize`        |                                                  | resize事件，当容器或者子孩子放生变化，此时触发                       |
| `scroll-change` | `CustomEvent<{ scrollTop: number; scrollLeft: number; }>` | 滚动事件，detail scrollTop,detail scrollLeft 说明内容滚动位置, |
| `scroll-x`      | `CustomEvent<{ value: number; oldValue: number; }>` | 水平滚动时触发 detail.value 内容区水平滚动大小 detail.oldValue 原始内容区水平滚动大小 |
| `scroll-x-end`  | `CustomEvent<{ value: number; }>`                | 水平滚动到最右侧触发      * detail.value 内容水平滚动大小          |
| `scroll-y`      | `CustomEvent<{ value: number; oldValue: number; }>` | 水平滚动时触发 detail.value 内容区水平滚动大小 detail.oldValue 原始内容区水平滚动大小 |
| `scroll-y-end`  | `CustomEvent<{ value: number; }>`                | 竖直滚动到底部时触发，detail.value,内容滚动高度                   |

## Slots

| Name     |
|----------|
| `内容slot` |


# p-option-group

## Properties

| Property | Attribute | Type     |
|----------|-----------|----------|
| `label`  | `label`   | `string` |


# p-option

## Properties

| Property   | Attribute  | Modifiers | Type          |
|------------|------------|-----------|---------------|
| `disabled` | `disabled` |           | `boolean`     |
| `hidden`   | `hidden`   |           | `boolean`     |
| `key`      | `key`      |           | `string`      |
| `label`    | `label`    |           | `string`      |
| `option`   |            | readonly  | `HTMLElement` |
| `selected` | `selected` |           | `boolean`     |
| `value`    | `value`    |           | `string`      |

## Methods

| Method  | Type       |
|---------|------------|
| `foucs` | `(): void` |


# p-select

## Properties

| Property       | Attribute     | Modifiers | Type              | Default |
|----------------|---------------|-----------|-------------------|---------|
| `disabled`     | `disabled`    |           | `boolean`         |         |
| `name`         | `name`        |           | `string`          |         |
| `optionCotent` |               | readonly  | `PPopContent`     |         |
| `placeholder`  | `placeholder` |           | `string`          | "请选址"   |
| `pop`          |               | readonly  | `Ppop`            |         |
| `required`     | `required`    |           | `boolean`         |         |
| `search`       | `search`      |           | `boolean`         |         |
| `type`         | `type`        |           | `buttonTypeValue` |         |
| `value`        | `value`       |           | `string`          | ""      |

## Methods

| Method  | Type       |
|---------|------------|
| `focus` | `(): void` |

## Events

| Event    | Type                              |
|----------|-----------------------------------|
| `change` | `CustomEvent<{ value: string; }>` |
| `select` | `CustomEvent<{ value: string; }>` |


# p-slider

## Properties

| Property     | Attribute   | Modifiers | Type               | Default     |
|--------------|-------------|-----------|--------------------|-------------|
| `alwaysTip`  | `alwaysTip` |           | `boolean`          | false       |
| `disabled`   | `disabled`  |           | `boolean`          | false       |
| `form`       |             | readonly  | `HTMLFormElement`  |             |
| `input`      |             | readonly  | `unknown`          |             |
| `lineColor`  | `lineColor` |           | `string`           | "undefined" |
| `lineSize`   | `lineSize`  |           | `lineSize`         | "undefined" |
| `max`        | `max`       |           | `number`           | "undefined" |
| `min`        | `min`       |           | `number`           | 0           |
| `name`       | `name`      |           | `string`           |             |
| `percent`    |             | readonly  | `number`           |             |
| `prefix`     | `prefix`    |           | `string`           | "undefined" |
| `required`   | `required`  |           | `boolean`          | false       |
| `showtips`   | `showtips`  |           | `boolean`          | true        |
| `slider`     |             | readonly  | `HTMLInputElement` |             |
| `step`       | `step`      |           | `number`           | 1           |
| `suffix`     | `suffix`    |           | `string`           | "undefined" |
| `tipContent` |             | readonly  | `string`           |             |
| `value`      | `value`     |           | `number`           | 0           |
| `vertical`   | `vertical`  |           | `boolean`          | false       |

## Methods

| Method         | Type                        |
|----------------|-----------------------------|
| `changeHander` | `(event: InputEvent): void` |
| `focus`        | `(): void`                  |
| `inputHander`  | `(event: InputEvent): void` |
| `reset`        | `(): void`                  |

## Events

| Event    | Type                              |
|----------|-----------------------------------|
| `change` | `CustomEvent<{ value: number; }>` |
| `input`  | `CustomEvent<{ value: number; }>` |


# p-steps

## Properties

| Property     | Attribute    | Modifiers | Type       | Default | Description    |
|--------------|--------------|-----------|------------|---------|----------------|
| `childStep`  |              | readonly  | `PStep[]`  |         |                |
| `current`    | `current`    |           | `number`   | 0       | 当前步骤，默认从0      |
| `size`       | `size`       |           | `sizeType` |         | 进度点 圆圈大小       |
| `startIndex` | `startIndex` |           | `number`   | 1       | 起始节点显示 序号，默认为1 |
| `vertical`   | `vertical`   |           | `boolean`  | false   | 是否为竖直          |


# p-step

## Properties

| Property      | Attribute     | Modifiers | Type     | Default     |
|---------------|---------------|-----------|----------|-------------|
| `description` | `description` |           | `string` |             |
| `icon`        | `icon`        |           | `string` | "undefined" |
| `index`       | `index`       |           | `number` | 0           |
| `parentSteps` |               | readonly  | `PSteps` |             |
| `title`       | `title`       |           | `string` |             |

## Methods

| Method          | Type          |
|-----------------|---------------|
| `isCurrentStep` | `(): boolean` |
| `isFinished`    | `(): boolean` |


# p-switch

## Properties

| Property   | Attribute  | Type      | Default |
|------------|------------|-----------|---------|
| `checked`  | `checked`  | `boolean` | false   |
| `disabled` | `disabled` | `boolean` | false   |
| `name`     | `name`     | `string`  | ""      |
| `value`    | `value`    | `string`  | ""      |

## Methods

| Method                | Type                                       | Description                                      |
|-----------------------|--------------------------------------------|--------------------------------------------------|
| `changeCheck`         | `(): void`                                 |                                                  |
| `dispatchChangeEvent` | `(): void`                                 |                                                  |
| `initialize`          | `(): void`                                 | Performs element initialization. By default this calls createRenderRoot to create the element renderRoot node and captures any pre-set values for registered properties. |
| `log`                 | `(methodName: string, array: any[]): void` |                                                  |
| `performUpdate`       | `(): void \| Promise<unknown>`             |                                                  |

## Events

| Event    | Type                                 |
|----------|--------------------------------------|
| `change` | `CustomEvent<{ checked: boolean; }>` |


# p-tab

## Properties

| Property           | Attribute     | Modifiers | Type            | Default |
|--------------------|---------------|-----------|-----------------|---------|
| `activeKey`        | `activeKey`   |           | `string`        | null    |
| `activeTab`        |               | readonly  | `PTabContent`   |         |
| `activeTabByIndex` |               |           | `number`        |         |
| `childTabPanel`    |               | readonly  | `PTabContent[]` |         |
| `tabAgile`         | `tabAgile`    |           | `tabAgile`      | null    |
| `tabPosition`      | `tabPosition` |           | `tabPosition`   | "top"   |

## Methods

| Method                | Type                              |
|-----------------------|-----------------------------------|
| `dispatchChangeEvent` | `(tabContent: PTabContent): void` |
| `findTab`             | `(key: string): PTabContent`      |
| `findTabByIndex`      | `(index: number): PTabContent`    |
| `getTabIndex`         | `(tab: PTabContent): number`      |

## Events

| Event            | Type                                             |
|------------------|--------------------------------------------------|
| `beforeChange`   | `CustomEvent<{ tabContent: PTabContent; label: string; key: string; }>` |
| `tab-change`     | `CustomEvent<{ tabContent: PTabContent; label: string; index: number; key: string; }>` |
| `tab-change-end` | `CustomEvent<{ tabContent: PTabContent; label: string; index: number; key: string; }>` |


# p-tab-content

## Properties

| Property   | Attribute  | Modifiers | Type      | Default |
|------------|------------|-----------|-----------|---------|
| `disabled` | `disabled` |           | `boolean` | false   |
| `icon`     | `icon`     |           | `string`  | null    |
| `key`      | `key`      |           | `string`  | null    |
| `label`    | `label`    |           | `string`  | null    |
| `tab`      |            | readonly  | `PTab`    |         |

## Methods

| Method            | Type       |
|-------------------|------------|
| `setActive`       | `(): void` |
| `updateTabHeader` | `(): void` |


# p-text

## Properties

| Property    | Attribute   | Modifiers | Type         | Default     |
|-------------|-------------|-----------|--------------|-------------|
| `code`      | `code`      |           | `false`      |             |
| `draggable` | `draggable` |           | `false`      |             |
| `mark`      | `mark`      |           | `false`      |             |
| `rows`      | `rows`      |           | `number`     | "undefined" |
| `truncated` |             | readonly  | `boolean`    |             |
| `type`      | `type`      |           | `typeString` |             |


# p-tips

## Properties

| Property | Attribute | Type       | Default |
|----------|-----------|------------|---------|
| `color`  | `color`   | `string`   | null    |
| `dir`    | `dir`     | `dirType`  | "auto"  |
| `show`   | `show`    | `showType` | null    |
| `tips`   | `tips`    | `string`   | null    |
| `type`   | `type`    | `typeType` | null    |


# p-tree-node

将数组对象根据转化为 root 子节点，

## Properties

| Property         | Attribute      | Modifiers | Type             | Default     |
|------------------|----------------|-----------|------------------|-------------|
| `close`          | `close`        |           | `boolean`        | false       |
| `closeable`      | `closeable`    |           | `boolean`        | true        |
| `directTreeNode` |                | readonly  | `PTreeNode[]`    |             |
| `icon`           | `icon`         |           | `string`         | null        |
| `name`           | `name`         |           | `string`         | null        |
| `nodeRender`     | `nodeRender`   |           | `TreeNodeRender` | null        |
| `subChildSize`   | `subChildSize` |           | `number`         | "undefined" |

## Methods

| Method       | Type                   |
|--------------|------------------------|
| `toogleNode` | `(event: Event): void` |


# p-tree

## Properties

| Property           | Attribute          | Modifiers | Type               | Default         |
|--------------------|--------------------|-----------|--------------------|-----------------|
| `cacheNodeStatus`  | `cacheNodeStatus`  |           | `boolean`          | true            |
| `data`             | `data`             |           | `TreeNodeData`     | null            |
| `filterData`       |                    | readonly  | `TreeNodeData`     |                 |
| `filterFn`         | `filterFn`         |           | `TreeFilter`       | "defaultFilter" |
| `filterString`     | `filter-string`    |           | `string`           | null            |
| `includeStartNode` | `includeStartNode` |           | `boolean`          | null            |
| `nodeRender`       | `nodeRender`       |           | `TreeNodeRender`   | null            |
| `rootCloseable`    | `rootCloseable`    |           | `boolean`          | true            |
| `startKey`         | `startKey`         |           | `string \| number` | null            |
| `startNode`        |                    | readonly  | `TreeNodeData`     |                 |

## Methods

| Method            | Type                                             |
|-------------------|--------------------------------------------------|
| `doFilterData`    | `(): void`                                       |
| `getNodeData`     | `(node: string \| PTreeNode): TreeNodeData`      |
| `renderEmptyNode` | `(): TemplateResult`                             |
| `renderNode`      | `(d: TreeNodeData): TemplateResult`              |
| `renderSubNode`   | `(d: TreeNodeData): TemplateResult \| TemplateResult[]` |
| `toJSONData`      | `(): any`                                        |
