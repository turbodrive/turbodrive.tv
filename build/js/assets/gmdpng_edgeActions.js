(function($,Edge,compId){
    var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
    console.log("EdgeAction !! - " + compId);
    
    (function(symbolName)            
        {Symbol.bindElementAction(compId,symbolName,"document","compositionReady",
            function(sym,e){
                console.log("EdgeAction 2")
                document.gmdReady(sym);
            });
//Edge binding end
        })("stage");
//Edge symbol end:'stage'
})(jQuery,AdobeEdge,"gmd-edge");

AdobeEdge.bootstrapCallback(function(compId) {
    console.log("bootstrapCallback >> " + compId)
});.