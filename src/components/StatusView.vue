<template>
  <div> 
    <v-row>
      <v-col cols="12" md="8">
        <v-card height="100%">
          <v-row>
            <v-col cols="12" lg="6">
            <chart-card :name="'고객사'" :chartdata="emptyChartData" :options="emptyChartOption" :charttype="4"/>
            </v-col>
            <v-col cols="12" lg="6">
            <chart-card :name="'계약'" :chartdata="emptyChartData" :options="emptyChartOption" :charttype="4"/>
            </v-col>
            <v-col cols="12" lg="6">
            <chart-card :name="'담당자'" :chartdata="emptyChartData" :options="emptyChartOption" :charttype="4"/>
            </v-col>
            <v-col cols="12" lg="6">
            <chart-card :name="'일감'" :chartdata="emptyChartData" :options="emptyChartOption" :charttype="4"/>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col height="100%" cols="12" md="4">
        <v-card class=" d-flex flex-wrap">
          <v-icon>mdi-filter</v-icon> 
          <v-chip color="primary">전체</v-chip>
          <v-chip close outlined color="primary"  class="mx-1">필터링</v-chip>
        </v-card>
        <v-card class="mt-4 px-4 d-flex flex-wrap align-center justify-xl-center">
          
          <v-chip v-for="el of period" small :key="el.index" outlined class="mx-1" color="primary">{{el.name}}</v-chip>

         <div class="d-flex mx-2">
          <div style="width:100px;">
            <v-menu
              ref="menu-stdp"
              v-model="onstdt"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="stdt"
                  readonly
                  dense
                  hide-details
                  
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="stdt"
                locale="ko-kr"
                @input="onstdt = false"
              />
            </v-menu>
          </div>

          <p class="ma-2 ml-0">
            ~
          </p>

          <div style="width:100px;">
            <v-menu
              ref="menu_eddp"
              v-model="oneddt"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y

              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="eddt"
                  dense
                  readonly
                  hide-details
                
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="eddt"
                locale="ko-kr"
                @input="oneddt = false"
              />
            </v-menu>
          </div>
          <v-btn
            depressed
            x-small
            fab
            class="mx-1"
            color="primary"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
         </div>
        </v-card>

        <v-card class="mt-4">
          <title-card :name="'검색필터'"/>
          <div class="ml-2 mr-4">
            <div class="d-flex">
              <div class="my-1" style="width:50%">
                <v-autocomplete
                v-model="selClient"
                :items="clientList"
                rounded
                dense
                outlined
                
                hide-details
                placeholder="고객사"
                />
              </div>
              <div class="my-1" style="width:50%">
                <v-autocomplete
                v-model="selContract"
                :items="contractList"
                rounded
                dense
                outlined
                hide-details

                placeholder="관련계약"
                />
              </div>       
            </div>       
            <div class="d-flex">
              <div class="my-1"  style="width:50%">
                <v-autocomplete
                v-model="selManufacturer"
                :items="manufacturerList"
                rounded
                dense
                outlined
                hide-details
                placeholder="제조사"
                />
              </div>       
              <div class="my-1" style="width:50%">
                <v-autocomplete
                v-model="selPIC"
                :items="PICList"
                rounded
                dense
                outlined
                hide-details
                placeholder="담당자"
                />
              </div>
            </div>  
            <div class="d-flex">

              <div class="my-1" style="width:50%">
                <v-autocomplete
                v-model="selWorkType"
                :items="workTypeList"
                rounded
                dense
                outlined
                hide-details
                placeholder="일감유형"
                />
              </div>       
              <div class="my-1" style="width:50%">
                <v-autocomplete
                v-model="selWorkStatus"
                :items="workStatusList"
                rounded
                dense
                outlined
                hide-details
                placeholder="일감상태"
                />
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-card height="250px">
          <title-card :name="'고객사'"/>
          <ag-grid v-if="isTableReady" style="height:100%" :columndefs="[]" :multiselection="[]" />

        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card  height="250px">
          <title-card :name="'계약'"/>
          <ag-grid v-if="isTableReady" style="height:100%" :columndefs="[]" :multiselection="[]" />


        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card  height="250px">
          <title-card :name="'모델'"/>
          <ag-grid v-if="isTableReady" style="height:100%" :columndefs="[]" :multiselection="[]" />

        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <v-card  height="250px">
          <title-card :name="'담당자'"/>
          <ag-grid v-if="isTableReady" style="height:100%" :columndefs="[]" :multiselection="[]" />


        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card  height="250px">
          <title-card :name="'일감유형'"/>
          <ag-grid v-if="isTableReady" style="height:100%" :columndefs="[]" :multiselection="[]" />
        </v-card>
      </v-col>
    </v-row>
    <v-card  height="100vh" class="mt-4">
      <v-tabs>
        <v-tab v-for="el of tabs" :key="el.id">{{el.name}}</v-tab>
      </v-tabs>
      <ag-grid v-if="isTableReady" style="height:100%" :columndefs="[]" :multiselection="[]" />
    </v-card>
  </div>
  
</template>

<script>
import AgGrid from './partial/AgGrid.vue'
import ChartCard from "./partial/ChartCard"
import TitleCard from './partial/TitleCard.vue'

export default {
  name:'StatusView',
  components:{
    ChartCard,
    TitleCard,
    AgGrid
  },
  beforeMount () {
    const day = new Date()
    this.eddt = day.toISOString().substr(0, 10)
    day.setDate(day.getDate() - 14)
    this.stdt = day.toISOString().substr(0, 10)

  },
  data(){
    return{
      tabs:[
        {name:'전체', id:1},
        {name:'신규', id:2},
        {name:'진행', id:3},
        {name:'완료', id:4},
      ],
      stdt: '',
      eddt: '',
      oneddt: false,
      onstdt: false, 
      clientList:[],
      selClient:null,

      isTableReady:false,
      
      contractList:[],
      selContract:null,
      
      manufacturerList:[],
      selManufacturer:null,
      
      PICList:[],
      selPIC:null,
      period:[
        {name:'금월',id:1},
        {name:'전월',id:2},
        {name:'금년',id:3},
        {name:'전년',id:4},

      ],
      
      workTypeList:[],
      selWorkType:null,
      
      workStatusList:[],
      selWorkStatus:null,
      emptyChartData: {
          labels: '',
          datasets: [
            {
              label: [''],
              data: [100],
              backgroundColor: '#e6e6e6',
            },
          ],
        },
        emptyChartOption: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          tooltips: {
            enabled: false,
          }, responsive: true,

          maintainAspectRatio: false,
        //  / cutoutPercentage: 75,
        },
      
    }
  }
}
</script>
