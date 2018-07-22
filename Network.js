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
        this._trainOnce();
        this.trainingIndex = i % this.trainingData.length;
    }
};

Network.prototype._trainOnce = function() {
    this.runOnce();

    // Calculate errors on output neurons
    var outputs = this.getOutputs();
    var pdOutputErrors = [];
    for (var i = 0; i < outputs.length; i++) {
        pdOutputErrors.push(outputs[i].calculatePDErrorWRTTotalInput(this.trainingData[this.trainingIndex].outputs[i]));
    }

    // Calculater errors on hidden layer neurons
    var errorsByLayer = [];
    errorsByLayer[this.layers.length - 1] = pdOutputErrors;
    for (var i = this.layers.length - 2; i >= 1; i--) {
        errorsByLayer[i] = [];
        for (var neuronIndex = 0; neuronIndex < this.layers[i].length; neuronIndex++) {
            var totalError = 0;

            for (var j = 1; j < this.layers[i + 1].length; j++) {
                totalError += errorsByLayer[i + 1][j - 1] * this.layers[i + 1][j].inputs[neuronIndex].weight;
            }

            errorsByLayer[i].push(totalError * this.layers[i][neuronIndex].calculatePDTotalNetInputWRTInput());
        }
    }

    // Update weights for everybody
    
};

Network.prototype.calculateOutputError = function() {
    var outputs = this.getOutputs();
    var totalError = 0;
    for(var i = 0; i < outputs.length; i++) {
        totalError += outputs[i].calculateError(this.trainingData[this.trainingIndex].outputs[i]);
    }
    return totalError;
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
        outputs.push(this.layers[this.layers.length - 1][i]);
    }
    return outputs;
};

Network.prototype.setTrainingData = function(trainingData) {
    this.trainingData = trainingData;
};