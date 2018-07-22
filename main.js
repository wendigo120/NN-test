
var trainingData = []

var dataSize = 100;
for (var i = 0; i < dataSize; i++) {
    var input = (1 / dataSize) * i;
    var output = (Math.sin(input * 2 * Math.PI) + 1) / 2;
    trainingData.push({
        inputs: [input],
        outputs: [output]
    });
}

var n = new Network(trainingData, 0.5, 97);

n.addInput(0);
for (var i = 1; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
        var neuron = new Neuron(NeuronTypes.TANH);
        n.addNeuron(neuron, i);
    }
}
var neuron = new Neuron(NeuronTypes.TANH);
n.addNeuron(neuron, 5);

setTimeout(function() {
    n.train();
}, 0);

setInterval(() => {
    n.print();
}, 16);