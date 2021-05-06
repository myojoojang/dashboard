<template>
  <div>
    <div class="d-flex align-center">
      <h4 class="ma-4">{{ title }}</h4>
      <v-spacer />
      <div style="width: 200px;" v-if="showFilter">
        <v-select
          v-model="selWorkType"
          :items="workTypes"
          item-text="name"
          item-value="state"
          rounded
          background-color="backColor"
          hide-details
          class="mx-4 pa-0"
          placeholder="상태별보기"
        />
      </div>
    </div>

    <v-divider />

    <v-data-table
      :headers="headers"
      dense
      :items="tabledata"
      :items-per-page="10"
    />
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    tabledata: {
      type: Array,
      default: null,
    },
    title: {
      type: String,
      default: '상세',
    },
    showFilter: {
      type: Boolean,
      default: true,
    },
    headers: {
      type: Array,
      default: () => [
        {
          text: '유형',
          value: 'type',
        },

        {
          text: '상태',
          value: 'state',
        },

        {
          text: '우선순위',
          value: 'rank',
        },

        {
          text: '제목',
          value: 'title',
        },
        {
          text: '담당자',
          value: 'owner',
        },
        {
          text: '변경',
          value: 'updated',
        },
        {
          text: '프로젝트',
          value: 'projectType',
        },
        {
          text: '상위일감',
          value: '',
        },
        {
          text: '소요시간',
          value: 'duration',
        },
        {
          text: '완료기한',
          value: 'dueDate',
        },
        {
          text: '시작시간',
          value: 'startDate',
        },
      ],
    },
  },
  data() {
    return {
      workTypes: [
        { name: '전체', value: 0 },
        { name: '신규', value: 1 },
        { name: '진행', value: 2 },

        { name: '완료', value: 3 },
        { name: '지체', value: 4 },
      ],
      selWorkType: { name: '전체', value: 0 },
    }
  },
}
</script>

<style></style>
