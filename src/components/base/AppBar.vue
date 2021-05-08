<template>
  <div>
    <v-app-bar app color="transparent" elevation="0" absolute>
      <v-btn
        fab
        class="ma-0 mr-2"
        x-small
        text
        color="white"
        depressed
        @click.stop="sidebarMenu = !sidebarMenu"
      >
        <v-icon v-if="!sidebarMenu" class="ma-0" large>mdi-menu-right</v-icon>
        <v-icon v-else class="ma-0" large>mdi-menu-left</v-icon>
      </v-btn>

      <v-toolbar-title class="font-weight-bold white--text">
        {{ $route.name }}
      </v-toolbar-title>

      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer
      mobile-breakpoint="800"
      v-model="sidebarMenu"
      app
      floating
      color="transparent"
    >
      <v-card flat color="primary" class="pa-0 mx-2 mt-3">
        <v-list>
          <v-list-item link to="/">
            <v-list-item-content>
              <v-list-item-title
                class="d-flex align-center justify-center white--text"
              >
                <v-icon class="mx-1" color="white"
                  >mdi-circle-multiple-outline</v-icon
                >

                <h3>Coin Tracker</h3>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card depressed flat color="white" class="ma-2 mt-1 pa-1">
        <v-list rounded>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon color="primary">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "AppBar",
  data: () => ({
    sidebarMenu: true,
    items: [
      { title: "Dashboard", to: "/", icon: "mdi-map-outline" },
      { title: "WIP", to: "personal", icon: "mdi-calendar-check" },
    ],
  }),

  //  computed: {
  //     getRouterTitle() {
  //       const cur = this.$router.currentRoute.path.replace('/','')
  //       for (let el of this.items){
  //         if(el.to===cur){
  //           return el.title
  //         }
  //       }
  //     },
  //   },
};
</script>
