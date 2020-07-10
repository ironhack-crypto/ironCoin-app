import React, { Component, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './nav/Navbar.js'
import { TimelineMax, TweenMax, Power3 } from 'gsap';


const Ticker =(props)=>{   
// 3 different coin groups. 10 coins each   
    const coinGroup1= props.coins.filter((each,ind)=>{
        return ind<7
    })
    const coinGroup2= props.coins.filter((each,ind)=>{
        return ind<=13 && ind>=7
    })
    const coinGroup3= props.coins.filter((each,ind)=>{
        return ind<=20 && ind>=14
    })

    let currentGroup=coinGroup1


//STYLES===================================================================================
    const tickerWindow={
        textAlign: 'center',
        backgroundColor: '#282a36',
        position: 'fixed',
        padding: '7vh 0 0 1vw',
        color: 'white',
        // backgroundColor: '#424242',
        width: '100%',
        height: '109px',
        // zIndex: '1999'
    }


//===========================================================================================




    const tickWindow =()=>{

        return currentGroup.map((eachCoin,val)=>{
            return (

                <div key={eachCoin.id} className={'test'+val} onClick={()=>clearInterv()} style={{ width: '100%', padding: '0 15px'}}>
                    <Link to='/' style={{ color: 'inherit', display: 'inline-flex', alignItems: 'baseline', width: '200px', borderBottom: '1px solid lightgreen'}}>
                        <h1 style={{color:'lightgreen', fontSize: '20px', paddingRight: '20px'}}>{eachCoin.symbol}</h1>
                        <span id={'sp'+val} style={{color: 'lightgrey'}}>(${eachCoin.quote.USD.price.toFixed(2)})</span>
                    </Link>
                </div>                
            )            
        })        
    }//end tickWindow

    

//GSAP animations==============================================================
    const changeSymbol=()=>{
        // tickWindow(coinGroup3)
        let coin=[]
        switch(currentGroup[0]){
            case coinGroup1[0]:
                coin=coinGroup2;
                currentGroup=coinGroup2;
                break;
            case coinGroup2[0]:
                coin=coinGroup3;
                currentGroup=coinGroup3;
                break;
            default:
                coin=coinGroup1;
                currentGroup=coinGroup1;
                break;
        }

    const lengthCheck=(name)=>{
        let res=name
        if(res.length>10){
            res= name.split(' ')[0];
        }
        return res
    }

        for(let i=0;i<currentGroup.length;i++){
            if(coin[i]) {
                document.querySelector('.test'+i+' h1').innerHTML=lengthCheck(coin[i].name)
                document.querySelector('.test'+i+' span').innerHTML='('+coin[i].quote.USD.price.toFixed(2)+')'
            }
        }
    }//end changeSymbol



    const fadeOut =()=>{
        let tl=new TimelineMax        

        tl.to('.test0',.8,{opacity: 0, x:5})
        for(let i=1;i<11;i++){
          tl.to('.test'+i,.5,{opacity: 0, x:5},'-=.2')
        }

        //delays function call to change inner information until elements aren't visible
        setTimeout(changeSymbol,3090)

        tl.to('.test0',.5,{opacity: 1, x:0})
        for(let i=1;i<11;i++){
            tl.to('.test'+i,.5,{opacity: 1, x:0},'-=.2')
          }
    }//end fadeOut

    //set and clear intervals
    let intVal=''
    const setInterv=()=>{
        intVal=setInterval(fadeOut, 10000);
    }
    const clearInterv=()=>{
        clearInterval(intVal)
    }

    
// ========================================================================================

    return (
        <div>
            <Navbar />
            <div style={tickerWindow}>
                <div style={{display: 'inline-flex'}}>
                    {/* <button onClick={fadeOut}>fade</button> */}
                    {tickWindow()}
                    {setInterv()}              
                </div>
            </div>
        </div>
    );

}

export default Ticker;