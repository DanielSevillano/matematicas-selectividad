import { baseLayerLuminance, StandardLuminance } from "https://unpkg.com/@fluentui/web-components"

if (window.matchMedia('(prefers-color-scheme: dark)').matches) baseLayerLuminance.withDefault(StandardLuminance.DarkMode);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (this.matches) baseLayerLuminance.withDefault(StandardLuminance.DarkMode);
    else baseLayerLuminance.withDefault(StandardLuminance.LightMode);
});