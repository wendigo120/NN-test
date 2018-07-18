var i = 0;
var ErrorFunctions = {
    ABSOLUTESQUARED: i++, // TODO: implement different error functions
}
var Network = function(trainingData) {
    this.layers = [];

    this.trainingData = trainingData || [];
};

Network.prototype.runOnce = function() {
    for (var i = 0; i < this.layers.length; i++) {
        for (var j = 0; j < this.layers[i].length; j++) {
            this.layers[i][j].doMath();
        }
    }
};

Network.prototype.train = function() {
    this.trainingIndex = 0;
    for (var i = 0; i < 1000; i++) {
        this.runOnce();
        var error = this._getError();
        // change weights
    }
};

Network.prototype._getError = function() {
    var currentOutputs = this.getOutputs();
    var error = 0;
    for(var i = 0; i < currentOutputs.length; i++) {
        error += (this.trainingData[this.trainingIndex].outputs[i] - currentOutputs[i]) ^ 2;
    }
    return Math.abs(error);
};

Network.prototype.addNeuron = function(neuron, layer) {
    if (this.layers[layer]) {
        this.layers[layer].push(neuron);
    } else {
        this.layers[layer] = [new Neuron(NeuronTypes.LOCKED, 1), neuron];
    }

    if (layer !== 0) {
        for (var i = 0; i < this.layers[layer - 1].length; i++) {
            neuron.addInput(this.layers[layer - 1][i]);
        }
    }

    if (this.layers[layer + 1] ){
        for (var i = 0; i < this.layers[layer + 1].length; i++) {
            this.layers[layer + 1][i].addInput(neuron);
        }
    }
};

Network.prototype.addInput = function(input) {
    var neuron = new Neuron(NeuronTypes.LOCKED, input);
    this.addNeuron(neuron, 0);
};

Network.prototype.getOutputs = function() {
    var outputs = [];
    for (var i = 1; i < this.layers[this.layers.length - 1].length; i++) {
        outputs.push(this.layers[this.layers.length - 1][i].output);
    }
    return outputs;
};

Network.prototype.setTrainingData = function(trainingData) {
    this.trainingData = trainingData;
};