<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" label-width="120px" :rules="rules" :model="fromData">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="fromData.name" style="width: 80%;" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="fromData.code" style="width: 80%;" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native 修饰符可以找到原生元素的事件 这里可以省略 因为本身el已自带 -->
        <el-select v-model="fromData.manager" style="width: 80%;" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 遍历选项 -->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="fromData.introduce"
          style="width: 80%;"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    // 需要传入一个props变量来控制 显示或者隐藏
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },

  // 组件状态值
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false
      if (this.fromData.id) {
        // 编辑 有id
        isRepeat = depts
          .filter((item) => item.id !== this.fromData.id && item.pid === this.treeNode.pid)
          .some((item) => item.name === value)
      } else {
        // 新增
        isRepeat = depts.filter((item) => item.pid === this.treeNode.id).some((item) => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.fromData.id) {
        // 编辑 有id
        isRepeat = depts.some((item) => item.id !== this.fromData.id && item.code === value && value)
      } else {
        // 新增
        isRepeat = depts.some((item) => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 定义表单数据
      fromData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
        ]
      },
      peoples: []
    }
  },
  // 计算属性
  computed: {
    showTitle() {
      return this.fromData.id ? '编辑部门' : '新增部门'
    }
  },
  // 侦听器
  watch: {},
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {},

  mounted() {},
  // 组件方法
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      // console.log(this.peoples)
    },

    btnOK() {
      // 手动效验表单
      this.$refs.deptForm.validate(async(isOK) => {
        if (isOK) {
          if (this.fromData.id) {
            // 编辑
            await updateDepartments(this.fromData)
          } else {
            // 新增
            //  调用新增接口 添加父部门的id
            await addDepartments({
              ...this.fromData,
              pid: this.treeNode.id
            })
          }
          //  表单效验通过
          // 告诉父组件 新增数据成功 重新拉取数据
          this.$emit('addDepts')
          // update:props名称
          this.$emit('update:showDialog', false)
        }
      })
    },

    btnCancel() {
      //  因为resetFields 只能重置表单上的数据 非表单上的 比如编辑中的id 不能重置
      this.fromData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 关闭弹出层
      this.$emit('update:showDialog', false)
      // 清除效验规则
      this.$refs.deptForm.resetFields()
    },
    // 获取部门详情
    async getDepartDetail(id) {
      this.fromData = await getDepartDetail(id)
    }
  }
}
</script>

<style scoped lang="less"></style>
