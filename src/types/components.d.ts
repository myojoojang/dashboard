import 'vuetify/types/lib';
import type * as VuetifyComponents from 'vuetify/lib';

declare module 'vue' {
  export interface GlobalComponents {
    VAlert: typeof VuetifyComponents.VAlert;
    VApp: typeof VuetifyComponents.VApp;
    VBtn: typeof VuetifyComponents.VBtn;
    VCard: typeof VuetifyComponents.VCard;
    VCardText: typeof VuetifyComponents.VCardText;
    VChip: typeof VuetifyComponents.VChip;
    VCol: typeof VuetifyComponents.VCol;
    VDialog: typeof VuetifyComponents.VDialog;
    VDivider: typeof VuetifyComponents.VDivider;
    VIcon: typeof VuetifyComponents.VIcon;
    VImg: typeof VuetifyComponents.VImg;
    VMain: typeof VuetifyComponents.VMain;
    VProgressLinear: typeof VuetifyComponents.VProgressLinear;
    VRow: typeof VuetifyComponents.VRow;
    VSelect: typeof VuetifyComponents.VSelect;
    VSheet: typeof VuetifyComponents.VSheet;
    VSpacer: typeof VuetifyComponents.VSpacer;
    VTab: typeof VuetifyComponents.VTab;
    VTabs: typeof VuetifyComponents.VTabs;
    VToolbar: typeof VuetifyComponents.VToolbar;
  }
}
