//
// this is just a stub for a function you need to implement
//

function largestLineLength(lines){
	let largest = 0;
	//console.log(lines);
	for(let i = 0; i < lines.length; i++){
		let line = lines[i];
		if(line.length > largest){
			//console.log(line);
			//console.log(line.length);
			largest = line.length;
		}
	}
	return largest;
}

function findNumEmptyLines(lines){
	let count  = 0;
	for(let i = 0; i < lines.length; i++){
		if(lines[i].replace(/\s/g, "") === "")
			count++;
	}
	
	return count;
}

function getLinesInfo(txt){
	if(txt === "")
		return{
			numLines: 0,
			largestLine: 0,
			numNonEmptyLines:0
		};
	let lines = txt.split('\n');
	let linesLength = lines.length;
	if(lines[lines.length - 1] === "")
		lines.pop();
	console.log(lines);
	let largestLine = largestLineLength(lines);
	let numNonEmptyLines = lines.length - findNumEmptyLines(lines);
	return {
		numLines: linesLength, 
		largestLine: largestLine,
		numNonEmpty: numNonEmptyLines
	};
}

function removeEmptyStrings(splitTxt){
	for(let i = 0; i < splitTxt.length; i++){
		if(splitTxt[i] === "")
			splitTxt.splice(i,1);
	}
	
	return splitTxt;
}

function indexWordFrequencies(word, wordFrequencies){
	for(let i in wordFrequencies){
		if(word === wordFrequencies[i].word){
			return i;
		}
	}
	return -1;
}

function getWordFrequencies(words){
	let wordFrequencies = [];
	for(let i in words){
		let index = indexWordFrequencies(words[i], wordFrequencies);
		if(index != -1){
			wordFrequencies[index].frequency++;
		}
		else{
			let word = words[i];
			let wordFrequencyObj = {
				word: word,
				frequency: 1
			};
			wordFrequencies.push(wordFrequencyObj)
		}
	}
	return wordFrequencies;
}

function getMostFrequentWords(words){
	let wordFrequencies = getWordFrequencies(words);
	let frequencyComparer = function(a,b){
		return b.frequency - a.frequency;
	};
	
	let sortedFrequencies = wordFrequencies.sort(frequencyComparer);
	let frequentWords = [];
	let currentFrequency = 0; 
	while(sortedFrequencies .length != 0 && getSize2DArr(frequentWords) < 10){
		//console.log(sortedWords);
		let wordsWithSameFrequency = [];
		currentFrequency  =  sortedFrequencies[0].frequency;
		while( sortedFrequencies.length != 0 && sortedFrequencies[0].frequency === currentFrequency){
			//console.log(sortedWords[0].length);
			wordsWithSameFrequency.push(sortedFrequencies.shift());
		}
		frequentWords.push(wordsWithSameFrequency);
	}
	
	let alphabeticComparer = function(a,b){
		if(b.word < a.word)
			return 1;
		else if(b.word === a.word)
			return 0;
		else
			return -1;
	};

	console.log(frequentWords);	

	for(let i in frequentWords){
		frequentWords[i] = frequentWords[i].sort(alphabeticComparer);
	}
	
	
	let fWords = [];

	for(let i in frequentWords){
		fWords = fWords.concat(frequentWords[i]);
	}

	while(fWords.length > 10)
		fWords.pop();	

	console.log(fWords);
	return fWords;
	
}

function removeRepeats(words){
	let wordsWithoutRepeats = [];
	for(let i in words){
		let notInArray = true;
		for(let j in wordsWithoutRepeats){
			if(words[i] === wordsWithoutRepeats[j])
				notInArray = false;
		}
		if(notInArray){
			wordsWithoutRepeats.push(words[i]);
		}
	}
	return wordsWithoutRepeats;
}

function getSize2DArr(twoDArr){
	let size = 0;
	for(let i in twoDArr){
		size += twoDArr[i].length;
	}
	return size;
}


function getLongestWords(words){
	let lenComparer = function(a,b){
		return b.length - a.length;
	};
	let wordsWithoutRepeats = removeRepeats(words);
	let sortedWords = wordsWithoutRepeats.sort(lenComparer);
	let largestWords = [];
	let currentSize = 0; 
	while(sortedWords.length != 0 && getSize2DArr(largestWords) < 10){
		//console.log(sortedWords);
		let wordsWithSameSize = [];
		currentSize =  sortedWords[0].length;
		while( sortedWords.length != 0 && sortedWords[0].length === currentSize ){
			//console.log(sortedWords[0].length);
			wordsWithSameSize.push(sortedWords.shift());
		}
		largestWords.push(wordsWithSameSize);
	}
	
	for(let i in largestWords){
		largestWords[i] = largestWords[i].sort();
	}

	let lWords = [];

	for(let i in largestWords){
		lWords = lWords.concat(largestWords[i]);
	}

	while(lWords.length > 10)
		lWords.pop();
	
	return lWords;
	
}

function isPalindrome(word){
	if(word.length <=2)
		return false;
	let s = 0;
	let e = word.length - 1;
	while(s < e){
		if(word.charAt(s) != word.charAt(e)){
			return false;
		}
		s++;
		e--;
	}
	return true;
}

function getAverageWordLength(words){
	let total = 0; 
	if(words.length === 0)
		return 0;
	for(let i = 0; i < words.length; i++)
	{
		total += words[i].length;
	}
	return total / words.length;
}

function getWordInfo(txt){
	let lowerCaseTxt = txt.toLowerCase();
	let words = lowerCaseTxt.split(/\W+/);
	words = removeEmptyStrings(words);
	let averageWordLength = getAverageWordLength(words);
	let palindromes = [];
	for(let i = 0; i < words.length; i++){
		if(isPalindrome(words[i])){
			palindromes.push(words[i]);
		}
	}
	palindromes = removeRepeats(palindromes);
	let largestWords = getLongestWords(words);
	let mostFrequent = getMostFrequentWords(words);
	let strMostFreq = [];
	for(let i in mostFrequent){
		strMostFreq.push(mostFrequent[i].word + "(" + mostFrequent[i].frequency.toString() + ")");
	}
	return{
		numWords: words.length,
		aveWordLen: averageWordLength,
		palindrms: palindromes,
		largestWrds: largestWords,
		mostFreq: strMostFreq
	};
}


function getStats(txt) {
	let numChars = txt.length;
	let lineInfo  = getLinesInfo(txt);
	let wordInfo = getWordInfo(txt);
    return {
        nChars: numChars,
        nWords: wordInfo.numWords,
        nLines: lineInfo.numLines,
        nNonEmptyLines: lineInfo.numNonEmpty,
        averageWordLength: wordInfo.aveWordLen,
        maxLineLength: lineInfo.largestLine,
        palindromes: wordInfo.palindrms,
        longestWords: wordInfo.largestWrds,
        mostFrequentWords: wordInfo.mostFreq
    };
}

