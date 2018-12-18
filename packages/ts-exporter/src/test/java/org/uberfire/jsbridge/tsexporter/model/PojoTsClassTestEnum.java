package org.uberfire.jsbridge.tsexporter.model;

import com.google.testing.compile.CompilationRule;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.uberfire.jsbridge.tsexporter.decorators.DecoratorStore.NO_DECORATORS;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.init;
import static org.uberfire.jsbridge.tsexporter.util.TestingUtils.type;
import static org.uberfire.jsbridge.tsexporter.util.Utils.lines;

public class PojoTsClassTestEnum {

    @Rule
    public final CompilationRule compilationRule = new CompilationRule();

    @Before
    public void before() {
        init(compilationRule.getTypes(), compilationRule.getElements());
    }

    enum E {
        A,
        B,
        C
    }

    @Test
    public void testEnum() {
        final PojoTsClass pojoTsClass = new PojoTsClass(type(E.class), NO_DECORATORS);
        assertEquals(lines("",
                           "import { JavaEnum } from 'appformer-js';",
                           "",
                           "export class E extends JavaEnum<E> { ",
                           "",
                           "  public static readonly A:E = new E(\"A\");",
                           "  public static readonly B:E = new E(\"B\");",
                           "  public static readonly C:E = new E(\"C\");",
                           "",
                           "  protected readonly _fqcn: string = E.__fqcn();",
                           "",
                           "  public static __fqcn(): string {",
                           "    return 'org.uberfire.jsbridge.tsexporter.model.PojoTsClassTestEnum$E';",
                           "  }",
                           "",
                           "  public static values() {",
                           "    return [E.A, E.B, E.C];",
                           "  }",
                           "}"),
                     pojoTsClass.toSource());
    }
}