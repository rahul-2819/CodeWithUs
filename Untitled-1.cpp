#include "testlib/testlib.h"
#include <fstream>

int main(int argc, char* argv[]) {
    registerGen(argc, argv, 1);
    int n = 10;

    for (int i = 0; i < n; i++) {
        std::string filename = "test_case_" + std::to_string(i) + ".txt";
        std::ofstream file(filename);
        int m = rnd.next(1,100);
        file << m << "\n";
        for (int j = 0; j < m; j++) {
            file << rnd.next(1, 100) << " ";
        }
        file<<"\n";
        file.close();
    }

    return 0;
}