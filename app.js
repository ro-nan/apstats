const appConfig = {
  submissionEndpoint: window.EXPERIMENT_CONFIG?.submissionEndpoint ?? "",
  studyName: "Paint Temperature Shape Study",
  studyVersion: "1.2.0",
  colorModel: "OKLCH-T",
};

const completionStorageKey = "paint-temperature-shape-study-completed";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function srgbToLinear(component) {
  const normalized = component / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function linearToSrgb(component) {
  const clamped = clamp(component, 0, 1);
  const value = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return Math.round(clamp(value * 255, 0, 255));
}

function oklchToSrgb(L, C, hDegrees) {
  const h = (hDegrees * Math.PI) / 180;
  const a_ = C * Math.cos(h);
  const b_ = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = L - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = L - 0.0894841775 * a_ - 1.2914855480 * b_;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return {
    r: linearToSrgb(rLin),
    g: linearToSrgb(gLin),
    b: linearToSrgb(bLin),
  };
}

function paintTemperatureToRgb(temperature) {
  const normalized = clamp((temperature - 2000) / 8000, 0, 1);
  const lightness = 0.76 - 0.04 * Math.abs(normalized - 0.5) * 2;
  const chroma = 0.11 + 0.05 * Math.sin(normalized * Math.PI);
  const hue = 248 - 165 * normalized;

  return oklchToSrgb(lightness, chroma, hue);
}

const shapeGroups = {
  spiky: {
    key: "spiky",
    label: "Spiky",
    svgs: [
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m193.50131 625.51447l312.75592 -534.6142l312.7559 534.6142z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m193.50131 625.51447l312.75592 -534.6142l312.7559 534.6142z" fill-rule="evenodd"/></g></svg>`,
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m171.0 613.80054l0 -546.2992l720.9134 546.2992z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m171.0 613.80054l0 -546.2992l720.9134 546.2992z" fill-rule="evenodd"/></g></svg>`,
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m130.50131 642.5932l147.59842 -590.39374l560.71655 0l-147.59845 590.39374z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m130.50131 642.5932l147.59842 -590.39374l560.71655 0l-147.59845 590.39374z" fill-rule="evenodd"/></g></svg>`,
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m234.0 327.60367l244.34647 -268.2047l244.34647 268.2047l-244.34647 268.20474z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m234.0 327.60367l244.34647 -268.2047l244.34647 268.2047l-244.34647 268.20474z" fill-rule="evenodd"/></g></svg>`,
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m318.45703 291.05643l161.54297 -223.10367l161.54297 223.10367l-61.70392 360.98935l-199.6781 0z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m318.45703 291.05643l161.54297 -223.10367l161.54297 223.10367l-61.70392 360.98935l-199.6781 0z" fill-rule="evenodd"/></g></svg>`,
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m68.25197 268.64566l823.4961 0l0 182.70868l-823.4961 0z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m68.25197 268.64566l823.4961 0l0 182.70868l-823.4961 0z" fill-rule="evenodd"/></g></svg>`,
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m306.51968 163.13387l346.9606 0l0 393.7323l-346.9606 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m248.69292 105.30708l462.61414 0l-57.826782 57.826782l-346.9606 0z" fill-rule="evenodd"/><path fill="#cbcbcb" d="m248.69292 614.69293l57.826767 -57.826782l346.9606 0l57.826782 57.826782z" fill-rule="evenodd"/><path fill="#ffffff" d="m248.69292 105.30708l57.826767 57.826782l0 393.7323l-57.826767 57.826782z" fill-rule="evenodd"/><path fill="#989898" d="m711.30707 105.30708l0 509.38586l-57.826782 -57.826782l0 -393.7323z" fill-rule="evenodd"/><path fill="#ffffff" fill-opacity="0.0" d="m248.69292 105.30708l462.61414 0l0 509.38586l-462.61414 0zm57.826767 57.826782l346.9606 0l0 393.7323l-346.9606 0zm-57.826767 -57.826782l57.826767 57.826782m-57.826767 451.55908l57.826767 -57.826782m404.78738 -451.55908l-57.826782 57.826782m57.826782 451.55908l-57.826782 -57.826782" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m248.69292 105.30708l462.61414 0l0 509.38586l-462.61414 0zm57.826767 57.826782l346.9606 0l0 393.7323l-346.9606 0zm-57.826767 -57.826782l57.826767 57.826782m-57.826767 451.55908l57.826767 -57.826782m404.78738 -451.55908l-57.826782 57.826782m57.826782 451.55908l-57.826782 -57.826782" fill-rule="evenodd"/></g></svg>`,
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m423.83658 79.65092l105.8602 157.82626l-43.666107 18.612076l133.33847 135.24258l-43.666077 22.58368l164.84564 226.43396l-279.55972 -173.531l53.31607 -24.089264l-173.6995 -111.15332l62.24231 -34.342773l-183.39774 -116.60454z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m423.83658 79.65092l105.8602 157.82626l-43.666107 18.612076l133.33847 135.24258l-43.666077 22.58368l164.84564 226.43396l-279.55972 -173.531l53.31607 -24.089264l-173.6995 -111.15332l62.24231 -34.342773l-183.39774 -116.60454z" fill-rule="evenodd"/></g></svg>`,
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m286.19946 137.70079l124.19949 481.49866l308.70078 -334.8005l39.601074 -236.69817l-150.30188 250.19948l-140.39893 -243.0l-333.0 -9.900261l273.60104 99.0z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m286.19946 137.70079l124.19949 481.49866l308.70078 -334.8005l39.601074 -236.69817l-150.30188 250.19948l-140.39893 -243.0l-333.0 -9.900261l273.60104 99.0z" fill-rule="evenodd"/></g></svg>`,
      `<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m263.70078 310.4987l-20.700775 -37.797913l-162.90027 -223.19946l369.0 278.99738l-94.49869 -259.19946l170.09976 285.30182l360.90027 -262.80054l-257.4016 368.09973l293.4016 162.0l-407.7008 -61.199463l-192.60104 86.398926l208.8005 -202.49869l-324.0 63.0l75.60104 -117.90027l-189.90025 -10.800507z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m263.70078 310.4987l-20.700775 -37.797913l-162.90027 -223.19946l369.0 278.99738l-94.49869 -259.19946l170.09976 285.30182l360.90027 -262.80054l-257.4016 368.09973l293.4016 162.0l-407.7008 -61.199463l-192.60104 86.398926l208.8005 -202.49869l-324.0 63.0l75.60104 -117.90027l-189.90025 -10.800507z" fill-rule="evenodd"/></g></svg>`,
    ],
  },
  rounded: {
    key: "rounded",
    label: "Rounded",
      svgs: [
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m235.14948 270.82974c-4.8183136 -42.978333 11.001175 -85.52426 40.745697 -109.584c29.744507 -24.059738 68.19751 -25.413712 99.04193 -3.4873962c10.926056 -24.98938 30.92389 -42.24283 53.94458 -46.541504c23.02069 -4.2986755 46.360382 4.86232 62.95923 24.711945c9.307587 -22.656975 27.58316 -37.87957 48.341644 -40.266006c20.758484 -2.386444 41.062073 8.401001 53.70587 28.5344c16.81549 -24.016342 43.569397 -34.12822 68.68512 -25.960167c25.115723 8.168045 44.082275 33.14897 48.69275 64.13338c20.601807 6.820755 37.762756 24.159973 47.04889 47.537796c9.286133 23.377823 9.78656 50.5009 1.3719482 74.36153c20.286804 32.047455 25.03241 74.750275 12.46582 112.172516c-12.566589 37.42227 -40.557373 63.941742 -73.52673 69.66177c-0.23236084 35.12213 -16.102112 67.34979 -41.49225 84.26099c-25.390198 16.911255 -56.33606 15.865295 -80.90973 -2.7346802c-10.467041 42.06482 -39.928406 73.015686 -75.65558 79.480774c-35.727203 6.465027 -71.31546 -12.714783 -91.38934 -49.25305c-24.606384 18.009827 -54.13199 23.197876 -81.91644 14.39386c-27.784454 -8.804016 -51.487335 -30.858582 -65.76175 -61.188477c-25.144623 3.5714111 -49.45601 -12.240906 -60.8685 -39.589325c-11.412476 -27.34842 -7.4966125 -60.411163 9.804169 -82.7793c-22.429672 -16.023468 -33.874634 -47.819336 -28.366806 -78.80731c5.507843 -30.987976 26.720367 -54.146057 52.576096 -57.398224z" fill-rule="evenodd"/><path fill="#ffffff" fill-opacity="0.0" d="m210.44315 408.69174c10.584625 7.5615234 22.812347 10.991608 35.041397 9.829712m16.01744 112.541595c5.2589417 -0.74694824 10.413696 -2.3287354 15.331329 -4.704529m132.33951 51.497192c-3.698822 -6.732483 -6.795624 -13.926758 -9.237701 -21.460205m176.289 -8.768799c1.9083252 -7.6690063 3.1447144 -15.562134 3.6886597 -23.547607m118.70868 -57.975708c0.24743652 -37.392914 -17.25055 -71.63028 -44.977966 -88.0061m106.03833 -93.82422c-4.4903564 12.733002 -11.345398 24.02826 -20.027649 33.000183m-28.389038 -154.90285c0.7651367 5.141876 1.1192017 10.361023 1.057373 15.585114m-118.43323 -53.756783c-4.19458 5.990883 -7.6504517 12.685616 -10.259827 19.875755m-91.788635 -8.146759c-2.235382 5.4414825 -3.9046326 11.199493 -4.969269 17.141403m-111.93625 4.6885986c6.5266724 4.6396027 12.564728 10.223846 17.981506 16.630081m-157.76733 96.441925c0.664093 5.923523 1.7133789 11.774017 3.1380615 17.496735" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m235.14948 270.82974c-4.8183136 -42.978333 11.001175 -85.52426 40.745697 -109.584c29.744507 -24.059738 68.19751 -25.413712 99.04193 -3.4873962c10.926056 -24.98938 30.92389 -42.24283 53.94458 -46.541504c23.02069 -4.2986755 46.360382 4.86232 62.95923 24.711945c9.307587 -22.656975 27.58316 -37.87957 48.341644 -40.266006c20.758484 -2.386444 41.062073 8.401001 53.70587 28.5344c16.81549 -24.016342 43.569397 -34.12822 68.68512 -25.960167c25.115723 8.168045 44.082275 33.14897 48.69275 64.13338c20.601807 6.820755 37.762756 24.159973 47.04889 47.537796c9.286133 23.377823 9.78656 50.5009 1.3719482 74.36153c20.286804 32.047455 25.03241 74.750275 12.46582 112.172516c-12.566589 37.42227 -40.557373 63.941742 -73.52673 69.66177c-0.23236084 35.12213 -16.102112 67.34979 -41.49225 84.26099c-25.390198 16.911255 -56.33606 15.865295 -80.90973 -2.7346802c-10.467041 42.06482 -39.928406 73.015686 -75.65558 79.480774c-35.727203 6.465027 -71.31546 -12.714783 -91.38934 -49.25305c-24.606384 18.009827 -54.13199 23.197876 -81.91644 14.39386c-27.784454 -8.804016 -51.487335 -30.858582 -65.76175 -61.188477c-25.144623 3.5714111 -49.45601 -12.240906 -60.8685 -39.589325c-11.412476 -27.34842 -7.4966125 -60.411163 9.804169 -82.7793c-22.429672 -16.023468 -33.874634 -47.819336 -28.366806 -78.80731c5.507843 -30.987976 26.720367 -54.146057 52.576096 -57.398224z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m210.44315 408.69174c10.584625 7.5615234 22.812347 10.991608 35.041397 9.829712m16.01744 112.541595c5.2589417 -0.74694824 10.413696 -2.3287354 15.331329 -4.704529m132.33951 51.497192c-3.698822 -6.732483 -6.795624 -13.926758 -9.237701 -21.460205m176.289 -8.768799c1.9083252 -7.6690063 3.1447144 -15.562134 3.6886597 -23.547607m118.70868 -57.975708c0.24743652 -37.392914 -17.25055 -71.63028 -44.977966 -88.0061m106.03833 -93.82422c-4.4903564 12.733002 -11.345398 24.02826 -20.027649 33.000183m-28.389038 -154.90285c0.7651367 5.141876 1.1192017 10.361023 1.057373 15.585114m-118.43323 -53.756783c-4.19458 5.990883 -7.6504517 12.685616 -10.259827 19.875755m-91.788635 -8.146759c-2.235382 5.4414825 -3.9046326 11.199493 -4.969269 17.141403m-111.93625 4.6885986c6.5266724 4.6396027 12.564728 10.223846 17.981506 16.630081m-157.76733 96.441925c0.664093 5.923523 1.7133789 11.774017 3.1380615 17.496735" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m204.59842 360.0c0 -152.10008 123.30148 -275.40158 275.40158 -275.40158c73.041016 0 143.09052 29.015442 194.73834 80.663246c51.647766 51.647827 80.66321 121.69728 80.66321 194.73833c0 152.1001 -123.30145 275.40155 -275.40155 275.40155c-152.1001 0 -275.40158 -123.30145 -275.40158 -275.40155zm137.7008 0c0 76.05005 61.650726 137.70078 137.70078 137.70078c76.05005 0 137.7008 -61.650726 137.7008 -137.70078c0 -76.05005 -61.650757 -137.70079 -137.7008 -137.70079c-76.05005 0 -137.70078 61.65074 -137.70078 137.70079z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m204.59842 360.0c0 -152.10008 123.30148 -275.40158 275.40158 -275.40158c73.041016 0 143.09052 29.015442 194.73834 80.663246c51.647766 51.647827 80.66321 121.69728 80.66321 194.73833c0 152.1001 -123.30145 275.40155 -275.40155 275.40155c-152.1001 0 -275.40158 -123.30145 -275.40158 -275.40155zm137.7008 0c0 76.05005 61.650726 137.70078 137.70078 137.70078c76.05005 0 137.7008 -61.650726 137.7008 -137.70078c0 -76.05005 -61.650757 -137.70079 -137.7008 -137.70079c-76.05005 0 -137.70078 61.65074 -137.70078 137.70079z" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m480.0 209.43045c122.44092 -342.83466 599.9606 0 0 440.78738c-599.96063 -440.78738 -122.44095 -783.6221 0 -440.78738z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m480.0 209.43045c122.44092 -342.83466 599.9606 0 0 440.78738c-599.96063 -440.78738 -122.44095 -783.6221 0 -440.78738z" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m273.90552 360.0c0 -113.822845 92.27164 -206.09448 206.09448 -206.09448c54.659668 0 107.08057 21.713455 145.73083 60.363678c38.650208 38.650208 60.363647 91.07114 60.363647 145.7308c0 113.822845 -92.27167 206.09448 -206.09448 206.09448c-113.822845 0 -206.09448 -92.27164 -206.09448 -206.09448z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m273.90552 360.0c0 -113.822845 92.27164 -206.09448 206.09448 -206.09448c54.659668 0 107.08057 21.713455 145.73083 60.363678c38.650208 38.650208 60.363647 91.07114 60.363647 145.7308c0 113.822845 -92.27167 206.09448 -206.09448 206.09448c-113.822845 0 -206.09448 -92.27164 -206.09448 -206.09448z" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m40.80315 195.01772c146.39896 -78.56299 292.79788 78.563 439.19684 0c146.39893 -78.56299 292.7979 78.563 439.19684 0l0 329.9646c-146.39893 78.56299 -292.7979 -78.56302 -439.19684 0c-146.39896 78.56299 -292.7979 -78.56302 -439.19684 0z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m40.80315 195.01772c146.39896 -78.56299 292.79788 78.563 439.19684 0c146.39893 -78.56299 292.7979 78.563 439.19684 0l0 329.9646c-146.39893 78.56299 -292.7979 -78.56302 -439.19684 0c-146.39896 78.56299 -292.7979 -78.56302 -439.19684 0z" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m329.39883 361.80182c-18.599731 -43.349945 -109.348206 -164.10062 -101.69815 -209.70079c7.6500397 -45.600166 84.748474 -91.80008 147.59842 -63.900253c62.849945 27.899826 192.75107 228.89896 229.50131 231.29922c36.750244 2.400238 -49.650024 -198.14787 -9.0 -216.89764c40.650024 -18.749779 227.40027 15.898949 252.90027 104.39895c25.5 88.500015 -56.69989 378.15094 -99.90027 426.60107c-43.20038 48.450134 -116.551636 -145.95013 -159.30182 -135.90027c-42.750244 10.049866 -18.599731 172.9497 -97.19949 196.19946c-78.59973 23.249817 -360.44925 -31.650879 -374.39896 -56.700806c-13.949692 -25.049866 292.35083 -73.04852 290.7008 -93.59839c-1.6500549 -20.549866 -289.05075 -7.800537 -300.60107 -29.700806c-11.550308 -21.900238 194.3994 -76.35083 231.29921 -101.700775c36.89981 -25.349945 8.699463 -7.049011 -9.900269 -50.398956z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m329.39883 361.80182c-18.599731 -43.349945 -109.348206 -164.10062 -101.69815 -209.70079c7.6500397 -45.600166 84.748474 -91.80008 147.59842 -63.900253c62.849945 27.899826 192.75107 228.89896 229.50131 231.29922c36.750244 2.400238 -49.650024 -198.14787 -9.0 -216.89764c40.650024 -18.749779 227.40027 15.898949 252.90027 104.39895c25.5 88.500015 -56.69989 378.15094 -99.90027 426.60107c-43.20038 48.450134 -116.551636 -145.95013 -159.30182 -135.90027c-42.750244 10.049866 -18.599731 172.9497 -97.19949 196.19946c-78.59973 23.249817 -360.44925 -31.650879 -374.39896 -56.700806c-13.949692 -25.049866 292.35083 -73.04852 290.7008 -93.59839c-1.6500549 -20.549866 -289.05075 -7.800537 -300.60107 -29.700806c-11.550308 -21.900238 194.3994 -76.35083 231.29921 -101.700775c36.89981 -25.349945 8.699463 -7.049011 -9.900269 -50.398956z" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m277.95276 179.39767c0 -37.19661 30.153809 -67.35043 67.35043 -67.35043l269.39365 0c17.862427 0 34.993286 7.095833 47.6239 19.726486c12.630676 12.630661 19.726501 29.761505 19.726501 47.623947l0 361.20468c0 37.196594 -30.153809 67.3504 -67.3504 67.3504l-269.39365 0c-37.196625 0 -67.35043 -30.153809 -67.35043 -67.3504z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m277.95276 179.39767c0 -37.19661 30.153809 -67.35043 67.35043 -67.35043l269.39365 0c17.862427 0 34.993286 7.095833 47.6239 19.726486c12.630676 12.630661 19.726501 29.761505 19.726501 47.623947l0 361.20468c0 37.196594 -30.153809 67.3504 -67.3504 67.3504l-269.39365 0c-37.196625 0 -67.35043 -30.153809 -67.35043 -67.3504z" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m511.1989 318.60175c-35.69989 -32.39981 -69.749756 -178.35081 -125.09973 -173.70078c-55.349945 4.6500397 -200.10016 133.35126 -206.99998 201.60104c-6.899826 68.24979 93.30095 185.24805 165.60103 207.89764c72.30011 22.649597 225.59976 -36.150024 268.1995 -72.0c42.59973 -35.849945 4.34906 -115.80008 -12.601074 -143.09973c-16.950134 -27.299652 -53.39978 11.70166 -89.09973 -20.698181z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m511.1989 318.60175c-35.69989 -32.39981 -69.749756 -178.35081 -125.09973 -173.70078c-55.349945 4.6500397 -200.10016 133.35126 -206.99998 201.60104c-6.899826 68.24979 93.30095 185.24805 165.60103 207.89764c72.30011 22.649597 225.59976 -36.150024 268.1995 -72.0c42.59973 -35.849945 4.34906 -115.80008 -12.601074 -143.09973c-16.950134 -27.299652 -53.39978 11.70166 -89.09973 -20.698181z" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m55.799557 245.70091c125.84996 -4.950119 615.45013 -18.300964 756.0 5.3989563c140.54987 23.699905 209.0993 112.35039 87.299194 136.80052c-121.80005 24.450134 -677.6999 27.750214 -818.09973 9.900269c-140.39983 -17.849976 -20.099297 -91.650055 -24.29921 -117.0c-4.199913 -25.34996 -126.75022 -30.149612 -0.90026474 -35.099747z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m55.799557 245.70091c125.84996 -4.950119 615.45013 -18.300964 756.0 5.3989563c140.54987 23.699905 209.0993 112.35039 87.299194 136.80052c-121.80005 24.450134 -677.6999 27.750214 -818.09973 9.900269c-140.39983 -17.849976 -20.099297 -91.650055 -24.29921 -117.0c-4.199913 -25.34996 -126.75022 -30.149612 -0.90026474 -35.099747z" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m84.456696 360.0c0 -71.82312 177.09076 -130.04724 395.5433 -130.04724c218.45251 0 395.54333 58.22412 395.54333 130.04724c0 71.82312 -177.09082 130.04724 -395.54333 130.04724c-218.45255 0 -395.5433 -58.22412 -395.5433 -130.04724z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m84.456696 360.0c0 -71.82312 177.09076 -130.04724 395.5433 -130.04724c218.45251 0 395.54333 58.22412 395.54333 130.04724c0 71.82312 -177.09082 130.04724 -395.54333 130.04724c-218.45255 0 -395.5433 -58.22412 -395.5433 -130.04724z" fill-rule="evenodd"/></g></svg>
    `,
    `
  <svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#ffffff" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"/><path fill="#ffffff" d="m196.94489 360.0c0 -156.32703 126.72809 -283.0551 283.0551 -283.0551c156.32703 0 283.0551 126.72809 283.0551 283.0551c0 156.32703 -126.72809 283.0551 -283.0551 283.0551c-156.32703 0 -283.0551 -126.72809 -283.0551 -283.0551z" fill-rule="evenodd"/><path fill="#cbcbcb" d="m359.8326 275.34555c0 -16.284058 13.200836 -29.48491 29.484924 -29.48491c16.284058 0 29.484894 13.200851 29.484894 29.48491c0 16.284058 -13.200836 29.484924 -29.484894 29.484924c-16.284088 0 -29.484924 -13.200867 -29.484924 -29.484924m181.36496 0c0 -16.284058 13.200867 -29.48491 29.484924 -29.48491c16.284058 0 29.484863 13.200851 29.484863 29.48491c0 16.284058 -13.200806 29.484924 -29.484863 29.484924c-16.284058 0 -29.484924 -13.200867 -29.484924 -29.484924" fill-rule="evenodd"/><path fill="#ffffff" fill-opacity="0.0" d="m326.58228 483.44223q153.41772 105.36441 306.47717 0" fill-rule="evenodd"/><path fill="#ffffff" fill-opacity="0.0" d="m196.94489 360.0c0 -156.32703 126.72809 -283.0551 283.0551 -283.0551c156.32703 0 283.0551 126.72809 283.0551 283.0551c0 156.32703 -126.72809 283.0551 -283.0551 283.0551c-156.32703 0 -283.0551 -126.72809 -283.0551 -283.0551z" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m359.8326 275.34555c0 -16.284058 13.200836 -29.48491 29.484924 -29.48491c16.284058 0 29.484894 13.200851 29.484894 29.48491c0 16.284058 -13.200836 29.484924 -29.484894 29.484924c-16.284088 0 -29.484924 -13.200867 -29.484924 -29.484924m181.36496 0c0 -16.284058 13.200867 -29.48491 29.484924 -29.48491c16.284058 0 29.484863 13.200851 29.484863 29.48491c0 16.284058 -13.200806 29.484924 -29.484863 29.484924c-16.284058 0 -29.484924 -13.200867 -29.484924 -29.484924" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m326.58228 483.44223q153.41772 105.36441 306.47717 0" fill-rule="evenodd"/><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m196.94489 360.0c0 -156.32703 126.72809 -283.0551 283.0551 -283.0551c156.32703 0 283.0551 126.72809 283.0551 283.0551c0 156.32703 -126.72809 283.0551 -283.0551 283.0551c-156.32703 0 -283.0551 -126.72809 -283.0551 -283.0551z" fill-rule="evenodd"/></g></svg>
    `
      ],
  },
};
const elements = {
  progressChip: document.getElementById("progress-chip"),
  svgHost: document.getElementById("svg-host"),
  temperatureSlider: document.getElementById("temperature-slider"),
  prevButton: document.getElementById("prev-button"),
  nextButton: document.getElementById("next-button"),
  resultsPanel: document.getElementById("results-panel"),
};

function hasCompletedStudy() {
  return window.localStorage.getItem(completionStorageKey) === "true";
}

function markStudyComplete() {
  window.localStorage.setItem(completionStorageKey, "true");
}

function shuffleArray(array) {
  const copy = array.slice();

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function buildTrials() {
  const shapeGroupsInUse = Object.values(shapeGroups).filter((shapeGroup) => shapeGroup.svgs.length > 0);
  const trials = [];
  const defaultTemperature = 4500;

  for (const shapeGroup of shapeGroupsInUse) {
    const shuffledSvgs = shuffleArray(shapeGroup.svgs);
    const selectedSvgs = shuffledSvgs.slice(0, 3);

    selectedSvgs.forEach((svgMarkup, index) => {
      trials.push({
        id: `${shapeGroup.key}-${index}`,
        shapeKey: shapeGroup.key,
        shapeLabel: shapeGroup.label,
        temperature: defaultTemperature,
        renderColor: paintTemperatureToRgb(defaultTemperature),
        svgMarkup,
      });
    });
  }

  return shuffleArray(trials);
}

function isCanvasPath(element) {
  const d = element.getAttribute("d") || "";

  return (
    d.includes("m0 0") &&
    d.includes("960") &&
    d.includes("720")
  );
}

function colorizeSvg(svgElement, color) {
  svgElement.style.color = color;

  svgElement.querySelectorAll("path, polygon, rect, circle, ellipse, polyline")
    .forEach((element) => {

      if (isCanvasPath(element)) {
        return;
      }

      const fill = element.getAttribute("fill");

      if (fill && fill !== "none") {
        element.setAttribute("fill", "currentColor");
      }

      const stroke = element.getAttribute("stroke");

      if (stroke && stroke !== "none") {
        element.setAttribute("stroke", "currentColor");
      }
    });
}

function createParticipantId() {
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}

function createExperiment() {
  const trials = buildTrials();

  return {
    trials,
    responses: Array.from({ length: trials.length }, () => null),
    currentIndex: 0,
    participantId: createParticipantId(),
    finishedAt: null,
    submissionPayload: null,
  };
}

let experiment = createExperiment();

function getCurrentTrial() {
  return experiment.trials[experiment.currentIndex];
}

function renderSvg(trial) {
  elements.svgHost.innerHTML = trial.svgMarkup;
  const svgElement = elements.svgHost.querySelector("svg");

  if (svgElement) {
    colorizeSvg(svgElement, `rgb(${trial.renderColor.r}, ${trial.renderColor.g}, ${trial.renderColor.b})`);
  }
}

function updateTrialView() {
  const trial = getCurrentTrial();
  const currentTemperature = Number(experiment.responses[experiment.currentIndex] ?? trial.temperature);
  trial.temperature = currentTemperature;
  trial.renderColor = paintTemperatureToRgb(currentTemperature);

  elements.progressChip.textContent = `${experiment.currentIndex + 1} / ${experiment.trials.length}`;
  elements.temperatureSlider.value = String(currentTemperature);
  elements.prevButton.disabled = experiment.currentIndex === 0;
  elements.nextButton.textContent = experiment.currentIndex === experiment.trials.length - 1 ? "Finish" : "Next";

  renderSvg(trial);
}

function saveCurrentResponse() {
  const trial = getCurrentTrial();
  const response = Number(elements.temperatureSlider.value);
  trial.temperature = response;
  trial.renderColor = paintTemperatureToRgb(response);
  experiment.responses[experiment.currentIndex] = response;

  const svgElement = elements.svgHost.querySelector("svg");
  if (svgElement) {
    colorizeSvg(svgElement, `rgb(${trial.renderColor.r}, ${trial.renderColor.g}, ${trial.renderColor.b})`);
  }
}

async function autoSubmitPayload(payload) {
  if (!appConfig.submissionEndpoint) {
    console.warn("Missing Google Apps Script submission endpoint.");
    return;
  }

  try {
    await fetch(appConfig.submissionEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("Auto-submit failed.", error);
  }
}

function showResults() {
  experiment.finishedAt = new Date().toISOString();
  experiment.submissionPayload = buildSubmissionPayload();
  markStudyComplete();

  document.querySelector(".experiment").classList.add("hidden");
  elements.resultsPanel.classList.remove("hidden");
  autoSubmitPayload(experiment.submissionPayload);
}

function buildSubmissionPayload() {
  const responses = experiment.trials.map((trial, index) => ({
    trial: index + 1,
    shape: trial.shapeLabel,
    colorModel: appConfig.colorModel,
    temperature: experiment.responses[index],
  }));

  return {
    studyName: appConfig.studyName,
    studyVersion: appConfig.studyVersion,
    colorModel: appConfig.colorModel,
    submittedAt: experiment.finishedAt || new Date().toISOString(),
    shapeGroup: Array.from(new Set(experiment.trials.map((t) => t.shapeKey))).join(','),
    participantId: experiment.participantId,
    responses,
  };
}

elements.temperatureSlider.addEventListener("input", () => {
  const value = Number(elements.temperatureSlider.value);
  const trial = getCurrentTrial();

  trial.temperature = value;
  trial.renderColor = paintTemperatureToRgb(value);

  const svgElement = elements.svgHost.querySelector("svg");
    if (svgElement) {
    colorizeSvg(svgElement, `rgb(${trial.renderColor.r}, ${trial.renderColor.g}, ${trial.renderColor.b})`);
  }
});

elements.prevButton.addEventListener("click", () => {
  if (experiment.currentIndex === 0) {
    return;
  }

  saveCurrentResponse();
  experiment.currentIndex -= 1;
  updateTrialView();
});

elements.nextButton.addEventListener("click", () => {
  saveCurrentResponse();

  if (experiment.currentIndex === experiment.trials.length - 1) {
    showResults();
    return;
  }

  experiment.currentIndex += 1;
  updateTrialView();
});

if (hasCompletedStudy()) {
  document.querySelector(".experiment").classList.add("hidden");
  elements.resultsPanel.classList.remove("hidden");
} else {
  updateTrialView();
}