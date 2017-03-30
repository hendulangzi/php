# php 通过当前时间，获取本周日期

 
    function riqi($week){
		$whichD=date('w',strtotime($week));
		$weeks=array();
		for($i=1;$i<=7;$i++){
			if($i<$whichD){
				$date=strtotime($week)-($whichD-$i)*24*3600;
			}else{
				$date=strtotime($week)+($i-$whichD)*24*3600;
			}
			$weeks[$i]=date('m-d',$date);

		}
		return $weeks;
	}
	$week = date('Y-m-d',time());
	var_dump(riqi($week));
 
