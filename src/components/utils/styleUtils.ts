import { defaultFilter } from "../tree/treeFillter";

const getStyleProperty = function (oE: HTMLElement, sPr: string) {
    sPr = sPr.replace(/([A-Z])/g, '-$1').toLowerCase();
    const d = document.defaultView.getComputedStyle(oE);
    return d.getPropertyValue(sPr);
  };
  export default getStyleProperty;