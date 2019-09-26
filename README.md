
<p align="center">
  <img src="https://image.flaticon.com/icons/svg/1646/1646720.svg" alt="Markdown Monster icon" width="300px" height="300px">
</p>
<h1 id="p-aligncenterstibtrack-p"><p align="center">StibTrack </p></h1>
<p><strong>StibTrack</strong> provides reliable <strong>real-time tracking</strong> information obtained directly from <em>STIB-MIVB public API</em>. You’ll find any STIB-MIVB vehicle real-time position on the map as well as stops, lines road, and more!.</p>
<p><img src="https://image.flaticon.com/icons/svg/197/197583.svg" alt="Markdown Monster icon" width="20px" height="15px">          <strong>ONLY FOR <em>BRUSSELS</em></strong>   <img src="https://image.flaticon.com/icons/svg/197/197583.svg" alt="Markdown Monster icon" width="20px" height="15px"></p>
<p>Most available mobile apps provide only the <strong>schedule</strong> for a given line (<em>potential arrival/departure</em>), so you can only <strong>guess</strong> where <strong>exactly you transport is</strong>. But if you are an every-day user of STIB-MIVB transportation system, you might want to have the possibility to check where your next ride is, and be a little bit ahead of time.</p>
<p><strong>This is an open-source project</strong>, so if you want to dig a little bit in the code, please check the source code. Also please keep in mind that you might encounter bugs, strange issues, broken things, and if you do, please let me know, <em>or just do a PR</em>  😃 !<br>
<br></p>
<blockquote>
<p><strong>Note:</strong> App’s availability on Google Play <em><strong>soon</strong></em>.<br>
<em>Sorry for iOS users, but no budget for that!.</em><br>
<br></p>
</blockquote>
<h3 id="p-aligncenterthanksp"><p align="center">Thanks!</p></h3>
 <p align="center">
 <img src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png" alt="Markdown Monster icon">
 </p>
<p align="center">
  <img src="https://www.workinlogistics.be/uploads/public/company/logos/58aef3b03a924.png" alt="Markdown Monster icon" width="170px" height="70px"></p>
<h2 id="the-app">The App</h2>
![app](https://im3.ezgif.com/tmp/ezgif-3-3288b956b6cc.gif)
<h2 id="considerations">Technical Considerations</h2>
1.	There is also a serve running  (<a href="https://github.com/dalisalvador/stibserver">stibServer</a> ) which has been deployed in Heroku. The main goal of this is to handle several users due to API limitations.<br>
2. According to <a href="https://opendata.stib-mivb.be/store/data">STIB-MIVB</a> : "<i>A vehicle position has a lifetime of about 20 seconds, therefore it is not necessary to poll the service at a higher frequency</i>". That's why, in the app,  the position is refreshed every 15 seconds. (check the circular progress animation)<br>
3. The app has been tested only in both Android and iOS emulators, but only in an iOS <b>real</b>.  
<h2 id="installation">Installation</h2>
<p>1-First clone it!</p>
<pre><code>git clone https://github.com/dalisalvador/stib.git
cd stib
</code></pre>
<p>2-Install dependencies</p>
<pre><code>npm install
</code></pre>
<p>3-Run it!</p>
<pre><code>react-native run-ios
</code></pre>
<p>or</p>
<pre><code>react-native run-android
</code></pre>
<blockquote>
<p>Since this is <em>React &gt; 0.60</em> for <strong>Android</strong> users the linking is done automatically, for <strong>iOS</strong> I recommend <a href="http://cocoapods.org/">CocoaPods</a></p>
</blockquote>
<h2 id="version">Version</h2>
<table>
<thead>
<tr>
<th>No.</th>
<th>Description</th>
<th>Date</th>
</tr>
</thead>
<tbody>
<tr>
<td>1.0</td>
<td>Initial Release</td>
<td>30.09.2019</td>
</tr>
</tbody>
</table><h2 id="license">License</h2>
<p>StibTrack is licensed under <a href="LICENSE">The MIT License</a>.</p>

