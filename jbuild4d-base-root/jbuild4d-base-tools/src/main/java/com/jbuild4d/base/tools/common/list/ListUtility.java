package com.jbuild4d.base.tools.common.list;

import java.util.*;

public class ListUtility {
    public static void RemoveDuplicate(List list) {
        HashSet h = new HashSet(list);
        list.clear();
        list.addAll(h);
    }

    public static List<Integer> ListStringToInt(List<String> source){
        List<Integer> result=new ArrayList<>();
        if(source!=null){
            for (String s : source) {
                result.add(Integer.valueOf(s));
            }
        }
        return result;
    }

    public static <T> boolean Exist(List<T> source,IListWhereCondition<T> condition){
        boolean result=false;
        for (T item : source) {
            if(condition.Condition(item)){
                result=true;
                break;
            }
        }
        return  result;
    }

    public static <T> List<T> Where(List<T> source,IListWhereCondition<T> condition ) {
        List<T> result=new ArrayList<T>();
        for (T item : source) {
            if(condition.Condition(item)){
                result.add(item);
            }
        }
        return  result;
    }

    public static <T,K> List<K> SelectSingle(List<T> source,ISelectSingle<T,K> selectSingle){
        List<K> result=new ArrayList<K>();
        for(T item :source){
            result.add(selectSingle.Select(item));
        }
        return result;
    }

    public static <T,K> Map<T,K> Map(List<K> source,IListLoopupCondition<T,K> condition){
        Map<T,K> result=new Hashtable<T, K>();
        for(K item:source){
            result.put(condition.Condition(item),item);
        }
        return result;
    }

    public static <T,K> Map<T,List<K>> Loopup(List<K> source,IListLoopupCondition<T,K> condition){
        Map<T,List<K>> result=new Hashtable<T, List<K>>();
        for(K item:source){
            if (result.containsKey(condition.Condition(item)))
            {
                List<K> temp = result.get(condition.Condition(item));
                temp.add(item);
            }
            else
            {
                List<K> temp=new ArrayList<K>();
                temp.add(item);
                result.put(condition.Condition(item), temp);
            }
        }
        return result;
    }

    public static <T> T WhereSingle(List<T> source,IListWhereCondition<T> condition){
        List<T> result=Where(source,condition);
        if(result!=null&&result.size()>0){
            return result.get(0);
        }
        return null;
    }

    public static <T> List<T> OrderBy(List<T> source,Comparator<T> order) {
        //List<T> result=new ArrayList<T>();

        /*for (int i = 0; i < source.size(); i++)
        {
            for (int j = 0; j < source.size()-i - 1; j++)
            {
                if (condition.OrderBy(source.get(j), source.get(j + 1)))
                {
                    T obj = new T();
                    obj = source.get(j);
                    source.set(j, source.get(j + 1));
                    source.set(j+1,obj);
                    //Source[j+1] = obj;
                }
            }
        }
        return source;*/
        Collections.sort(source,order);
        return  source;
        //return  result;
    }
}
