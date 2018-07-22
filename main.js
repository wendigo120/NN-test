
var n = new Network([
    {
        inputs: [0, 0], 
        outputs: [0]
    },
    {
        inputs: [0, 1], 
        outputs: [1]
    },
    {
        inputs: [1, 0], 
        outputs: [1]
    },
    {
        inputs: [1, 1], 
        outputs: [0]
    }
]);

n.addInput(0);
n.addInput(0);
for (var i = 1; i < 3; i++) {
    for (var j = 0; j < 2; j++) {
        var neuron = new Neuron(NeuronTypes.TANH);
        n.addNeuron(neuron, i);
    }
}
var neuron = new Neuron(NeuronTypes.TANH);
n.addNeuron(neuron, 3);

n.train();