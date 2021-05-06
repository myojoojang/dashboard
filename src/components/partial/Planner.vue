<template>
  <div>
    <div class="d-flex align-center mb-2">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-toolbar-title v-if="$refs.calendar">
        <h4>{{ $refs.calendar.title }}년</h4>
      </v-toolbar-title>
      <v-spacer />
      <div style="width: 200px;">
        <v-select
          v-model="type"
          :items="types"
          rounded
          background-color="backColor"
          hide-details
          class="mx-4 pa-0"
          placeholder="보기설정"
        />
      </div>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <v-calendar
      ref="calendar"
      v-model="selEvent"
      locale="ko-kr"
      :weekdays="weekday"
      :type="type"
      :events="events"
      :event-overlap-mode="mode"
      :event-overlap-threshold="30"
      :event-color="getEventColor"
      @change="getEvents"
      @click:event="showPost(event.id)"
    />
  </div>
</template>

<script>
export default {
  name: 'Planner',
  props: {
    apievents: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      type: 'month',
      types: ['month', 'week'],
      mode: 'stack',
      weekday: [0, 1, 2, 3, 4, 5, 6],

      selEvent: null,
      events: [],
      colors: [
        'primary',
        'primary darken-1',
        'primary darken-3',
        'primary lighten-3',

        'primary lighten-1',
      ],
      names: ['지원', '교육', '계약', '프리세일즈', '장애'],
    }
  },
  methods: {
    getEvents({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        })
      }

      this.events = events
    },
    getEventColor(event) {
      return event.color
    },

    //이건그냥 데모용 이벤트 랜덤으로 만들어 주는 코드
    // api데이터 끌고오면 필요없습니다.
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
  },
}
</script>

<style></style>
