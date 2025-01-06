package com.example.be.utils.excel;

import lombok.experimental.UtilityClass;
import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlEngine;
import org.jxls.common.Context;
import org.jxls.expression.JexlExpressionEvaluator;
import org.jxls.transform.Transformer;
import org.jxls.util.JxlsHelper;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

public class ExcelUtils {

    // ${fun:validateHttp(data.http)}
    public String validateHttp(boolean flag){
        if(flag)
            return "Yes";
        return "No";
    }
}
