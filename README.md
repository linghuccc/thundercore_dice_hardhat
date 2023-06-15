本 project 使用 hardhat 开发， 部署在 ThunderCore 测试网上，合约信息如下：

<table>
  <tr>
    <th>合约名称</th>
    <th>合约地址</th>
    <th>部署哈希</th>
  </tr>
  <tr>
    <td>TCUSD</td>
    <td>0x8130219E72ccdEF637756c5d8eb5f3Cf0ea85CB0</td>
    <td>0x07ae2e532bdc718459e6ce539ab10cecd61af33545ded98af4f0b563e9d81384</td>
  </tr>
  <tr>
    <td>Recreation</td>
    <td>0x1636ff0D4212Ea755D96cE88F4c0460aa29126E8</td>
    <td>0x2d494765956a23fccc998625f544ffc8f720dc5ff05ffec4064ae520bd54c037</td>
  </tr>
</table>

具体功能参见 Recreation.sol 注释部分；

下面功能参见 tasks/8.getWinnerMetrics.js

Record user metrics

-   Who wins the most of tokens
-   The number of win counts for each user
