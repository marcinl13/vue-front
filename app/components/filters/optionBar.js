import pagitation from "./pagitation.js";
import newButton from "./newButton.js";
import search from "./search.js";
import selectByPage from "./selectByPage.js";

export default Vue.component("conponent-optionBar", {
  props: [
    "pagi",
    "itemListCount",
    "currentPage",
    "dataSize",
    "selectRows",
    "searchBy",
    "optionBarSettings",
    "setSelectRows",
    "clickedButton"
  ],
  data: function() {
    return {};
  },
  methods: {
    optionPagi: function(_typ) {
      this.pagi(_typ);
    },
    optionSearchBy: function(_sth) {
      this.searchBy(_sth);
    },
    optionItemListCount: function(_num) {
      this.itemListCount(_num);
    },
    onclickedButton: function() {
      this.clickedButton();
    }
  },
  components: {
    pagitation: pagitation,
    newButton: newButton,
    search: search,
    selectByPage: selectByPage
  },
  template: `
    <div 
      class="d-flex align-items-center w-100" 
      :class="{
        'justify-content-around': Object.keys(optionBarSettings).length>1,
        'justify-content-center': Object.keys(optionBarSettings).length==1
      }" > 

      <selectByPage 
        v-if=optionBarSettings.selectByPage 
        :itemListCount=optionItemListCount
        :pagi=optionPagi
      />

      <pagitation 
        v-if=optionBarSettings.pagitation 
        :pagi=optionPagi 
        :currentPage=currentPage 
        :dataSize=dataSize 
        :selectRows=selectRows         
      />
       
      <search  
        v-if=optionBarSettings.searchBy 
        :searchBy=optionSearchBy 
      /> 

      <newButton 
        v-if=optionBarSettings.newButton 
        :onclickedButton=onclickedButton
      />
     
    </div>
  `
});
