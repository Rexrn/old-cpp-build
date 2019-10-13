module.exports = {
	gccFlags:
	{
		shared: {
			architecture: {
				x86: "-m32",
				x86_64: "-m64"
			},
			flags: {
				FatalCompileWarnings: "-Werror",
				LinkTimeOptimization: "-flto",
				ShadowedVariables: "-Wshadow",
				UndefinedIdentifiers: "-Wundef"
			},
			floatingPoint: {
				Fast: "-ffast-math",
				Strict: "-ffloat-store"
			},
			strictAliasing: {
				Off: "-fno-strict-aliasing",
				Level1: "-fstrict-aliasing -Wstrict-aliasing=1",
				Level2: "-fstrict-aliasing -Wstrict-aliasing=2",
				Level3: "-fstrict-aliasing -Wstrict-aliasing=3"
			},
			optimize: {
				Off: "-O0",
				On: "-O2",
				Debug: "-Og",
				Full: "-O3",
				Size: "-Os",
				Speed: "-O3"
			},
			pic: {
				On: "-fPIC"
			},
			vectorExtensions: {
				AVX: "-mavx",
				AVX2: "-mavx2",
				SSE: "-msse",
				SSE2: "-msse2",
				SSE3: "-msse3",
				SSSE3: "-mssse3",
				SSE4_1: "-msse4.1",
			},
			isaExtensions: {
				MOVBE: "-mmovbe",
				POPCNT: "-mpopcnt",
				PCLMUL: "-mpclmul",
				LZCNT: "-mlzcnt",
				BMI: "-mbmi",
				BMI2: "-mbmi2",
				F16C: "-mf16c",
				AES: "-maes",
				FMA: "-mfma",
				FMA4: "-mfma4",
				RDRND: "-mrdrnd"
			},
			warnings: {
				Extra: "-Wall -Wextra",
				High: "-Wall",
				Off: "-w"
			},
			unsignedChar: {
				On: "-funsigned-char",
				Off: "-fno-unsigned-char"
			},
			omitFramePointer: {
				On: "-fomit-frame-pointer",
				Off: "-fno-omit-frame-pointer"
			}
		},
		c: {
			standard: {
				"C89": "-std=c89",
				"C90": "-std=c90",
				"C99": "-std=c99",
				"C11": "-std=c11",
				"gnu89": "-std=gnu89",
				"gnu90": "-std=gnu90",
				"gnu99": "-std=gnu99",
				"gnu11": "-std=gnu11"
			}
		},
		cpp: {
			exceptionHandling: {
				Off: "-fno-exceptions"
			},
			flags: {
				NoBufferSecurityCheck: "-fno-stack-protector",
			},
			standard: {
				"C++98": "-std=c++98",
				"C++0x": "-std=c++0x",
				"C++11": "-std=c++11",
				"C++1y": "-std=c++1y",
				"C++14": "-std=c++14",
				"C++1z": "-std=c++1z",
				"C++17": "-std=c++17",
				"gnu++98": "-std=gnu++98",
				"gnu++0x": "-std=gnu++0x",
				"gnu++11": "-std=gnu++11",
				"gnu++1y": "-std=gnu++1y",
				"gnu++14": "-std=gnu++14",
				"gnu++1z": "-std=gnu++1z",
				"gnu++17": "-std=gnu++17"
			},
			rtti: {
				Off: "-fno-rtti"
			},
			visibility: {
				Default: "-fvisibility=default",
				Hidden: "-fvisibility=hidden",
				Internal: "-fvisibility=internal",
				Protected: "-fvisibility=protected"
			},
			inlinesVisibility: {
				Hidden: "-fvisibility-inlines-hidden"
			}
		}
	}
};