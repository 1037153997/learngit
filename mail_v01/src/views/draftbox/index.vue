<template>
  <div class="app-container calendar-list-container">
    <!--    -->
    <div class="filter-container">
      <!--    -->
      <el-button type="danger" v-waves size="small" class="tool-item filter-item btn-del" v-on:click="handleDelete()">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </el-button>
      <el-button type="primary" v-waves size="small" class="tool-item filter-item btn-reload" v-on:click="initPage">
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </el-button>
      <!--    -->
      <el-dropdown @command="handleMark" split-button size="small" type="primary" class="tool-item filter-item">
        标记为
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="label in labelList" :key="label.id" :command="label.id + ''">
            <i class="fa fa-star" aria-hidden="true" style="color: #0DCEDA; margin-right: 8px;"/>{{label.name}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-input @keyup.enter.native="handleFilter" size="small" style="width: 300px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>

      <span style="font-size: small">创建时间</span>
      <el-date-picker v-model="createDateRange" size="small" type="datetimerange" :picker-options="dateOptions" align="right" class="tool-item">
      </el-date-picker>
      <span style="font-size: small">最后修改时间</span>
      <el-date-picker v-model="lastModifyDateRange" size="small" type="datetimerange" :picker-options="dateOptions" align="right" class="tool-item">
      </el-date-picker>

      <el-button class="filter-item" v-waves type="primary" size="small" @click="handleFilter">
        <i class="fa fa-search" aria-hidden="true" style="color: #FFFFFF; margin-right: 8px;"/>
        <span>搜索</span>
      </el-button>
      <el-button class="filter-item" v-waves type="text" @click="handleDownload">
        <i class="fa fa-download" aria-hidden="true" style="color: #5EB3FF; margin-right: 8px;"/>
        <span>导出</span>
      </el-button>
    </div>
    <!--    -->
    <el-table :key='tableKey' :data="list" ref="multipleTable" @sort-change="customSort" @selection-change="handleSelectionChange" v-loading.body="listLoading" border highlight-current-row style="width: 100%">
      <!--    -->
      <el-table-column type="selection" min-width="30px">
      </el-table-column>
      <!--    -->
      <el-table-column align="left" width="90px" label="信息">
        <template slot-scope="scope">
          <i @click="toggleStar(scope.row)" style="color: #F08A5D;margin: 5px" :class="scope.row.isStar? 'fa fa-star':'fa fa-star-o'" aria-hidden="true"></i>
          <i v-if="scope.row.isHaveFile" style="color: #11999E;margin: 5px" class="fa fa-bookmark" aria-hidden="true"></i>
          <i v-if="scope.row.isHaveAudio" style="margin: 5px" class="fa fa-microphone" aria-hidden="true"></i>
        </template>
      </el-table-column>
      <!--    -->
      <el-table-column align="center" label="收件人" width="120px" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.receiveList | showReceiveName}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="title" sortable="custom" label="主题" :show-overflow-tooltip="true" min-width="400px">
        <template slot-scope="scope">
          <span class="link-type" @click="goToDetail(scope.row.id)">{{scope.row.title}}</span>
          <el-tag v-for="label in scope.row.labelList" :key="label.guid">{{label.name}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createDate" sortable="custom" align="center" label="创建时间" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastModifyDate" sortable="custom" align="center" label="最后修改时间" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.lastModifyDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import * as draftboxAPI from '../../api/draftbox';
import * as labelAPI from '../../api/mail_label';
import { getType } from '../../utils/validate';
import { parseTime } from '../../utils';

export default {
  name: 'draftbox',
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        title: '',
        startCreatDate: null,
        stopCreateDate: null,
        startModifyDate: null,
        stopModifyDate: null,
        sort: '',
        order: ''
      },
      multipleSelection: [],
      tableKey: 0,
      labelList: [],
      createDateRange: [],
      lastModifyDateRange: [],
      dateOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  created() {
    this.initPage();
  },
  filters: {
    showReceiveName(receiveList) {
      let nameStr = '';
      receiveList.forEach(item => nameStr += item.name + ';');
      return nameStr;
    },
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }

  },
  methods: {
    initPage() {
      this.getList();
      this.getLabelList();
    },
    getList() {
      this.listLoading = true;
      this.listQuery.startCreateDate = this.createDateRange[0] ? this.createDateRange[0].getTime() : null;
      this.listQuery.stopCreateDate = this.createDateRange[1] ? this.createDateRange[1].getTime() : null;
      this.listQuery.startModifyDate = this.lastModifyDateRange[0] ? this.lastModifyDateRange[0].getTime() : null;
      this.listQuery.stopModifyDate = this.lastModifyDateRange[1] ? this.lastModifyDateRange[1].getTime() : null;
      draftboxAPI.fetchList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    getLabelList() {
      labelAPI.fetchList().then(res => {
        this.labelList = res.data.labelList;
      })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    customSort(sortObj) {
      this.listQuery.sort = sortObj.prop;
      this.listQuery.order = sortObj.order;
      this.getList();
    },
    timeFilter(time) {
      if (!time[0]) {
        this.listQuery.start = undefined;
        this.listQuery.end = undefined;
        return;
      }
      this.listQuery.start = parseInt(+time[0] / 1000);
      this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
    },
    goToDetail(id) {
      this.$store.commit('SET_DRAFT_ID', id);
      this.$store.commit('SET_MAIL_ID', null);
      this.$store.commit('SET_PAGE_TYPE', 'edit');
      this.$store.commit('SET_MAIL_TYPE', 'draft');
      this.$router.push({ path: '/mail_send/index' });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete() {
      const selectedLen = this.multipleSelection.length || 0;
      if (selectedLen < 1) {
        this.$message('请选择草稿进行删除');
        return;
      }
      this.$confirm('是否删除这' + selectedLen + '封草稿?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idArr = [];
        this.multipleSelection.forEach(item => idArr.push(item.id));
        draftboxAPI.delDraft(idArr).subscribe({
          next: () => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
          },
          error: () => this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          })
        });
      }).catch(() => {
        this.$message('操作已取消');
      });
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel');
        const tHeader = ['收件人', '主题', '创建时间', '最后修改时间'];
        const filterVal = ['receiveList', 'title', 'createDate', 'lastmodifyDate'];
        const data = this.formatJson(filterVal, this.list);
        export_json_to_excel(tHeader, data, parseTime(Date.now()) + '草稿箱数据');
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (~j.indexOf('Date')) {
          return parseTime(v[j])
        } else if (getType(v[j]) === 'Array') {
          let str = '';
          v[j].forEach(item => str += item.name + '<' + item.mail + '>;');
          return str;
        } else {
          return v[j]
        }
      }))
    },
    toggleStar(row) {
      const idArr = [];
      if (row) {
        idArr.push(row.id);
      } else {
        const selectedLen = this.multipleSelection.length || 0;
        if (selectedLen < 1) {
          this.$message('请选择邮件进行标记');
          return;
        }
        this.multipleSelection.forEach(item => idArr.push(item.id));
      }
      labelAPI.toggleStar(idArr).subscribe({
        next: () => {
          if (row) {
            row.isStar = !row.isStar;
          } else {
            this.multipleSelection.forEach(item => item.isStar = true);
          }
        }
      })
    },
    handleMark(labelId) {
      if (labelId === 'star') {
        this.toggleStar();
      } else {
        const selectedLen = this.multipleSelection.length || 0;
        if (selectedLen < 1) {
          this.$message('请选择邮件进行标记');
          return;
        }
        const idArr = [];
        this.multipleSelection.forEach(item => idArr.push(item.id));
        labelAPI.markLabel(labelId, idArr).subscribe({
          next: () => this.getList()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/index.less';

.calendar-list-container{
  padding: 20px;
}

//.el-range-editor--small.el-input__inner {
//  width: 340px;
//}

</style>

