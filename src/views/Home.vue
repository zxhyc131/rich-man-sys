<template>
  <!-- 玩家信息 -->
  <div class="container mx-auto px-4 font-mono relative min-h-screen">
    <div class="sticky top-0 grid grid-cols-2 gap-4 mt-5">
      <el-button type="success" size="small" @click="$router.push('/vant')">去vant</el-button>
      <el-button type="danger" size="small" @click="initForm()">初始化</el-button>
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
        <el-button
          size="small"
          @click="unitOperation('add', form.unit, index)"
        >{{ '+' + form.unit }}</el-button>
        <el-button
          size="small"
          @click="unitOperation('sub', form.unit, index)"
        >{{ '-' + form.unit }}</el-button>
        <el-button type="success" size="small" @click="handle('add', index)">获得</el-button>
        <el-button type="danger" size="small" @click="handle('sub', index)">失去</el-button>
      </div>
    </div>
    <div class="mt-10"></div>
  </div>
  <!-- 初始信息填写 -->
  <el-dialog
    title="初始信息填写"
    v-model="dialogFormVisible"
    width="95%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form ref="elForm" :rules="rules" :model="form">
      <el-form-item label="设置人数" :label-width="formLabelWidth" prop="personNum">
        <el-input-number v-model="form.personNum" :precision="0" :step="1" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="初始金额" :label-width="formLabelWidth" prop="moneyNum">
        <el-input-number v-model="form.moneyNum" :precision="0" :step="1" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="最小金额单位" :label-width="formLabelWidth" prop="unit">
        <el-input v-model="form.unit" autocomplete="off" clearable style="width: 180px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer class="dialog-footer">
      <div class="grid grid-cols-2 gap-5">
        <el-button type="default" @click="closeInitForm()">取消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 金额操作 -->
  <el-dialog :title="title" v-model="changeMoneVisible" width="95%">
    <el-form ref="moneyForm" :rules="rules" :model="moneyForm">
      <el-form-item label="金额" :label-width="formLabelWidth" prop="moneyNum">
        <el-input-number
          v-model="moneyForm.moneyNum"
          :precision="0"
          :step="form.unit || 1"
          :min="0"
        ></el-input-number>
        <div>{{ kFormat(moneyForm.moneyNum) }}</div>
        <div>{{ number_chinese(moneyForm.moneyNum) }}</div>
      </el-form-item>

      <div class="grid grid-cols-2 gap-4 grid-box">
        <el-button size="small" @click="moneyNumOperation('add', form.unit)">{{ form.unit }}</el-button>
        <el-button size="small" @click="moneyNumOperation('add', 500)">{{ 500 }}</el-button>
        <el-button size="small" @click="moneyNumOperation('add', 10000)">{{ '10k' }}</el-button>
        <el-button size="small" @click="moneyNumOperation('add', 100000)">{{ '100k' }}</el-button>
        <el-button size="small" @click="moneyNumOperation('add', 1000000)">{{ '1M' }}</el-button>
        <el-button size="small" @click="clearCurrenyMoney()">清空</el-button>
      </div>
    </el-form>
    <template #footer class="dialog-footer">
      <div class="grid grid-cols-2 gap-5">
        <el-button @click="cancleMethods()">取 消</el-button>
        <el-button type="primary" @click="okMethods()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      input: '',
      dialogFormVisible: false,
      form: {
        personNum: 4, //人数
        moneyNum: 100000, //初始金钱
        unit: 1000,
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
      title: '获得金额',
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
    initForm() {
      this.dialogFormVisible = true
    },
    closeInitForm() {
      this.dialogFormVisible = false
    },
    submit() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
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
    cancleMethods() {
      this.moneyForm.moneyNum = 0
      this.changeMoneVisible = false
    },
    okMethods() {
      this.$refs['moneyForm'].validate(valid => {
        if (!valid) return;
        let currentMoney = this.list[this.activeIndex].money;
        let money = this.hand === 'add' ? currentMoney + (1 * this.moneyForm.moneyNum) : currentMoney - this.moneyForm.moneyNum;
        let obj = {
          name: this.list[this.activeIndex].name,
          money: money,
          unit: this.list[this.activeIndex].unit,
        }
        this.list[this.activeIndex] = obj
        this.changeMoneVisible = false
      })
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
