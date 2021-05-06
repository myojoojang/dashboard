<template>
  <router-view />
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap");

a {
  text-decoration: none;
}

body {
  height: 100%;
  /* background: linear-gradient(90deg, #FFC0CB 50%, #00FFFF 50%); */
}

.theme--light.v-application {
  background: linear-gradient(
    180deg,
    #5f7daf 120px,
    #faece5 0,
    #faece5 100%
  ) !important;
}

body .v-application {
  font-family: "Noto Sans KR", sans-serif !important;
  font-weight: 400;
  font-size: 0.95rem;
}
.small-text {
  font-size: 0.8rem;
}

body div .v-sheet.v-card:not(.v-sheet--outlined) {
  border-radius: 25px;
  -webkit-box-shadow: 11px 11px 10px -8px rgba(0, 102, 203, 0.1);
  box-shadow: 11px 11px 10px -8px rgba(0, 102, 203, 0.1);
  padding: 10px;
}

div .v-list .v-list-item--active {
  color: #5f7daf;
}

div .theme--light.v-select .v-select__selection--comma {
  color: #5f7daf;
  font-size: 0.8rem;
}

div .theme--light.v-icon {
  color: #5f7daf;
}

div .v-btn {
  border-radius: 25px;
}

#app
  > div
  > div
  > nav
  > div.v-navigation-drawer__content
  > div.ma-2.v-card.v-sheet.theme--light.white
  > div {
  border-radius: 25px !important;
}

div .v-navigation-drawer__border {
  width: 0px;
}

.v-navigation-drawer--is-mobile:not(.v-navigation-drawer--close),
.v-navigation-drawer--temporary:not(.v-navigation-drawer--close) {
  box-shadow: none !important;
}

div .v-tab {
  border-radius: 25px;
  height: 40px;
  margin-top: 5px;
}

div .v-tab--active {
  background: #5f7daf;
  color: #ffffff !important;
  border-radius: 25px;
  margin-left: 6px;
}
div .v-tabs-slider {
  display: none;
}

div .v-progress-linear__background {
  border-radius: 0 25px 25px 0;
}
div .v-progress-linear__determinate {
  border-radius: 25px 0 0 25px;
}
</style>