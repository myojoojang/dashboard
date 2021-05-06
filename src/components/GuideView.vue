<template>
  <div> 
    <v-row>
      <v-col cols=12 lg=2>
        <v-card class="d-flex flex-wrap align-center">
         <v-btn depressed color="primary" class="ma-1">나</v-btn>
         <v-btn outlined color="primary">전체</v-btn>
        </v-card>
      </v-col>
      <v-col cols=12 lg=10>
        <v-card >
        <div class="d-flex flex-wrap align-center">
          <div style="width:150px" >
            <v-select
              v-model="selFilter"
              :items="filters"
              item-text="name"
              return-object
              rounded
              dense
              outlined
              hide-details
              class="mx-1"
              @change="selectFilter"
            />
          </div>
          <div v-for="el of result" :key="el.index">
              <v-btn outlined color="primary" class="ma-1" >{{el.name}} ({{el.value}})</v-btn>
          </div>
        </div>
        

        </v-card>
      </v-col>

    </v-row>
     <v-card height="100vh" class="mt-4">
      <v-tabs>
        <v-tab v-for="el of tabs" :key="el.id">{{el.name}}</v-tab>
      </v-tabs>
      <ag-grid v-if="isTableReady" style="height:100%" :columndefs="[]" :multiselection="[]" />
     </v-card>
    <!-- <v-card class="mt-4">
      <v-row>
        <v-col cols="3">
          <v-btn   block color="primary">11</v-btn>
        </v-col>
        <v-col cols=3>
          <v-btn outlined  block color="primary">11</v-btn>
        </v-col>
        <v-col cols=3>
          <v-btn outlined  block color="primary">11</v-btn>
        </v-col>
          <v-col cols=3>
          <v-btn outlined  block color="primary">11</v-btn>
        </v-col>
      </v-row>
    </v-card> -->
  </div>
</template>

<script>
import AgGrid from './partial/AgGrid.vue'
export default {
  components: { AgGrid },
  name:'GuideView',
  data(){
    return{
      isTableReady:false,
      tabs:[
        {name:'전체', id:1},
        {name:'신규', id:2},
        {name:'진행', id:3},
        {name:'완료', id:4},
      ],
      filters:[
        {name:'데이터',value:1},
        {name:'일정',value:2},
        {name:'지연',value:3}

      ],
      selFilter: {name:'데이터',value:1},
      result:[
          {name:'계약번호 없음', value: 0},
          {name:'고객사 없음', value: 0},
          {name:'제품 없음', value: 0},
          {name:'담당자 없음', value: 0},
        ]
    }
  },
  methods:{
    selectFilter(){
      if(this.selFilter.value===1){
        this.result =[
          {name:'계약번호 없음', value: 0},
          {name:'고객사 없음', value: 0},
          {name:'제품 없음', value: 0},
          {name:'담당자 없음', value: 0},
        ]
      }
       if(this.selFilter.value===2){
        this.result =[
          {name:'완료기한 없음', value: 0},
          {name:'신규| 시작시간 있음', value: 0},
          {name:'진행| 시작시간 없음', value: 0},
          {name:'완료| 시작 또는 완료기한 없음', value: 0},
        ]
      }
       if(this.selFilter.value===3){
        this.result =[
          {name:'신규/진행| 완료기한 지남', value: 0},
   
        ]
      }
    }
  }

}
</script>

<style>

</style>