
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

var neuralNetwork = new Network(trainingData, 0.5, 97);

neuralNetwork.addInput(0);
for (var i = 1; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
        var neuron = new Neuron(NeuronTypes.TANH);
        neuralNetwork.addNeuron(neuron, i);
    }
}
var neuron = new Neuron(NeuronTypes.TANH);
neuralNetwork.addNeuron(neuron, 5);

setInterval(() => {
    neuralNetwork.print();
}, 33);

var run = function() {
    neuralNetwork.train();
};

var dumpNN = function() {
    console.log(JSON.stringify(neuralNetwork));
};