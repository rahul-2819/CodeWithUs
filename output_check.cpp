#include<bits/stdc++.h>
using namespace std;
int main() {
    for(int i = 0;i<10;i++){
   string input_filename = "test_case_"+to_string(i)+".txt"; // Specify the input file name
    ifstream input_file(input_filename);

    if (!input_file.is_open()) {
        cerr << "Failed to open input file: " << input_filename << std::endl;
        return 1;
    }

    // Read the input from the file
    string line;
    vector<int> numbers;

    // Read the first line (assuming it contains a single integer)
    getline(input_file, line);
    int n = stoi(line);

    // Read the remaining lines and extract the numbers
    while (getline(input_file, line)) {
        istringstream iss(line);
        int num;
        while (iss >> num) {
            numbers.push_back(num);
        }
    }
    ofstream file(input_filename,ios::app);
    //logic for solution
     long long sum = 0;
    for(int i = 0;i<n;i++){
        sum += numbers[i];
    }
    file<<sum<<"\n";
    file.close();
    }
    return 0;
}