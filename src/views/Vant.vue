<template>
  <!-- 玩家信息 -->
  <div class="container mx-auto px-4 font-mono relative min-h-screen">
    <div class="sticky top-0 grid grid-cols-2 gap-4 mt-5">
      <van-button type="primary" size="small" @click="$router.push('/')">去home</van-button>
      <van-button type="success" size="small" @click="openInitForm()">初始化</van-button>
    </div>
    <div class="text-gray-900 leading-tight mt-8">玩家信息</div>

    <div v-for="(item, index) in list" :key="item.name">
      <div class="grid md:grid-cols-4 grid-cols-3 gap-1 mt-4">
        <div class="name">{{ item.name }} :</div>
        <div>{{ kFormat(item.money) }}</div>
        <div>单位 {{ numFormat(form.unit) }}</div>
        <div class="col-span-2 text-left">{{ number_chinese(item.money) }}</div>
        <div class="col-span-1 text-left">{{ numFormat(item.money) }}</div>
      </div>
      <div class="grid md:grid-cols-4 grid-cols-4 gap-4 mt-4">
        <van-button
          @click="unitOperation('add', form.unit, index)"
          size="small"
        >{{ '+' + form.unit }}</van-button>

        <van-button
          @click="unitOperation('sub', form.unit, index)"
          size="small"
        >{{ '-' + form.unit }}</van-button>
        <van-button type="primary" size="small" @click="handle('add', index)">获得</van-button>
        <van-button type="warning" size="small" @click="handle('sub', index)">失去</van-button>
      </div>
    </div>
  </div>
  <!-- 金额操作 -->
  <van-dialog
    v-model:show="changeMoneVisible"
    :title="handTitle"
    show-cancel-button
    @confirm="okMethods"
  >
    <div class="mt-8"></div>
    <van-field name="personNum" label="金额">
      <template #input>
        <van-stepper
          v-model="moneyForm.moneyNum"
          :step="form.unit || 0"
          min="0"
          input-width="80px"
          integer
        />
      </template>
    </van-field>
    <van-cell center title="千分位数字" :value="kFormat(moneyForm.moneyNum)" />
    <van-cell center title="大写数字" :value="number_chinese(moneyForm.moneyNum)" />
    <div class="grid grid-cols-2 gap-4 grid-box mt-8 mb-8 ml-3 mr-3">
      <van-button size="small" @click="moneyNumOperation('add', form.unit)">{{ form.unit }}</van-button>
      <van-button size="small" @click="moneyNumOperation('add', 500)">{{ 500 }}</van-button>
      <van-button size="small" @click="moneyNumOperation('add', 10000)">{{ '10k' }}</van-button>
      <van-button size="small" @click="moneyNumOperation('add', 100000)">{{ '100k' }}</van-button>
      <van-button size="small" @click="moneyNumOperation('add', 1000000)">{{ '1M' }}</van-button>
      <van-button type="danger" size="small" @click="clearCurrenyMoney()">清空</van-button>
    </div>
  </van-dialog>
  <!-- 初始信息填写 -->
  <van-dialog
    v-model:show="dialogFormVisible"
    title="初始信息填写"
    show-cancel-button
    @open="initFormData"
    @confirm="submitInitForm"
  >
    <div class="mt-8"></div>
    <van-field name="personNum" label="设置人数">
      <template #input>
        <van-stepper v-model="initForm.personNum" :step="1" min="2" input-width="80px" integer />
      </template>
    </van-field>
    <van-field name="moneyNum" label="初始金额">
      <template #input>
        <van-stepper v-model="initForm.moneyNum" :step="1" input-width="80px" integer />
      </template>
    </van-field>
    <van-field name="moneyNum" label="最小金额单位">
      <template #input>
        <van-stepper v-model="initForm.unit" :step="1" input-width="80px" integer />
      </template>
    </van-field>
  </van-dialog>
</template>

<script>
const initData = {
  personNum: 4, //人数
  moneyNum: 100000, //初始金钱
  unit: 1000,
}
export default {
  data() {
    return {
      list: [],
      input: '',
      dialogFormVisible: false,
      form: {
        ...initData
      },
      initForm: {
        ...initData
      },
      rules: {
        moneyNum: [{
          required: true,
          message: '计数器',
          trigger: 'blur'
        }],
        unit: [{
          required: true,
          message: '请输入单位',
          trigger: 'blur'
        }],
        personNum: [{
          required: true,
          message: '计数器',
          trigger: 'blur'
        }],
      },
      formLabelWidth: '110px',
      changeMoneVisible: false,
      moneyForm: {
        moneyNum: 0
      },
      activeIndex: 0,
      hand: 'add'
    }
  },
  computed: {
    handStr() {
      return (this.hand === 'add' ? '+' : '-')
    },
    handTitle() {
      return (this.hand === 'add' ? '获得金额' : '失去金额')
    }
  },
  mounted() {
    this.$nextTick(() => {
      var arr = []
      if (this.form.personNum > 0) {
        var arr = []
        for (var i = 0; i < (+this.form.personNum); i++) {
          arr.push({
            name: '玩家' + (i + 1),
            money: this.form.moneyNum,
            unit: this.form.unit,
          })
        }
      }
      this.list = arr
      this.dialogFormVisible = false
    })
  },
  methods: {
    numFormat(num, digits = 0) {
      var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E4, symbol: "W" }
      ];
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    },
    kFormat(num) {
      num = num.toString().split(".");  // 分隔小数点
      var arr = num[0].split("").reverse();  // 转换成字符数组并且倒序排列
      var res = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        if (i % 3 === 0 && i !== 0) {
          res.push(",");   // 添加分隔符
        }
        res.push(arr[i]);
      }
      res.reverse(); // 再次倒序成为正确的顺序
      if (num[1]) {  // 如果有小数的话添加小数部分
        res = res.join("").concat("." + num[1]);
      } else {
        res = res.join("");
      }
      return res;
    },
    // 金额大写
    number_chinese(str) {
      var num = parseInt(str);
      var strOutput = "",
        strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
      num += "00";
      var intPos = num.indexOf('.');
      if (intPos >= 0) {
        num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
      }
      strUnit = strUnit.substr(strUnit.length - num.length);
      for (var i = 0; i < num.length; i++) {
        strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
      }
      return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元")
    },
    clearCurrenyMoney() {
      this.moneyForm.moneyNum = 0
    },
    moneyNumOperation(hand, unit) {
      let money = hand === 'add' ? this.moneyForm.moneyNum + (1 * unit) : this.moneyForm.moneyNum - unit;
      this.moneyForm.moneyNum = money
    },
    unitOperation(hand, unit, index) {
      let money = hand === 'add' ? this.list[index].money + (1 * unit) : this.list[index].money - (1 * unit);
      let obj = {
        name: this.list[index].name,
        money: money,
        unit: this.list[index].unit,
      }
      this.list[index] = obj
    },
    handle(hand, index) {
      this.moneyForm.moneyNum = 1 * (this.form.unit) || 1
      this.hand = hand
      this.activeIndex = index
      this.title = hand === 'add' ? '获得金额' : '失去金额'
      this.changeMoneVisible = true
    },
    openInitForm() {
      this.dialogFormVisible = true
    },
    closeInitForm() {
      this.dialogFormVisible = false
    },
    initFormData() {
      this.initForm = JSON.parse(JSON.stringify(initData))
    },
    submitInitForm() {
      this.$dialog.confirm({
        title: '提示',
        message: '你在初始化数据,请确认是否继续操作',
      })
        .then(() => {
          let arr = []
          if (this.initForm.personNum > 0) {
            for (let i = 0; i < (+this.initForm.personNum); i++) {
              arr.push({
                name: '玩家' + (i + 1),
                money: this.initForm.moneyNum,
                unit: this.initForm.unit,
              })
            }
          }
          this.form.unit = this.initForm.unit
          this.list = arr

        })
        .catch(() => {
          // on cancel
        });
    },
    cancleMethods() {
      this.moneyForm.moneyNum = 0
      this.changeMoneVisible = false
    },
    okMethods() {
      let currentMoney = this.list[this.activeIndex].money;
      let money = this.hand === 'add' ? currentMoney + (1 * this.moneyForm.moneyNum) : currentMoney - this.moneyForm.moneyNum;
      let obj = {
        name: this.list[this.activeIndex].name,
        money: money,
        unit: this.list[this.activeIndex].unit,
      }
      this.list[this.activeIndex] = obj
      this.changeMoneVisible = false
    },
  }
}
</script>

<style scoped lang='less'>
.item {
  overflow: hidden;
  clear: both;
  margin-bottom: 15px;
}
.personInfo {
  float: left;
  font-family: Microsoft YaHei;
  font-size: 16px;
  margin-right: 15px;
}

.name {
  margin-right: 10px;
}

.el-button + .el-button {
  margin-left: 0;
}
</style>
